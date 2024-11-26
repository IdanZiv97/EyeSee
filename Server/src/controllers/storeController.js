import mongoose from "mongoose";
import User from '../models/userModel.js';
import Store from '../models/storeModel.js'
import Report from "../models/reportModel.js";

/**
 * 
 In my vision, the user will have a button where he can add a new store, something like that
 The client is required the following data:
    1. userId
    2. storeName: a string that describes the new store
in case of failure the function will set success to failure and send a proper msg
In case of success the function will set success to true and send the following data
    1. newStoreId: the id of the new store
    2. mainStore: the name of the user's mainStore
    3. newStoreName: the name of the new store
    4. storesNames: an array with all the user's stores, including the new one
    5. msg: a prompt to display maybe
All of the above are data I think the client side would need to continue.
 */
export const createStore = async (req, res) => {
    try {
        // get from the body of the request the params for the store
        const userId = req.body.userId;
        const storeName = req.body.storeName;
        // get the user
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found, please try again"
            })
        }
        // given userId
        const existingStore = user.stores.some(store => store.name === storeName);
        if (existingStore) {
            return res.status(400).json({
                success: false,
                error: "Store with the same name already exists, choose another name"
            });
        }
        // Creating the new store
        const newStore = new Store({ name: storeName, owner: userId });
        await newStore.save();
        // TODO: need to handle errors saving the store
        if (user.mainStore === null) {
            user.set("mainStore", newStore._id);
        }
        user.stores.push(newStore._id);
        await user.save()
        const storesNames = (await user.populate('stores')).stores.map((s) => s.name);
        res.status(200).json({
            success: true,
            newStoreId: newStore._id,
            newStoreName: storeName,
            mainStore: user.mainStore.name,
            storesNames: storesNames,
            msg: "Store added succesfully."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Failed to add a new store, try again later."
        })
    }
};

/**
 * Function to handle the deletion of a store.
 * The function needs to recive the userId and storeName
 * In case of an error it will set success to false and add proper error message
 * Otherwise it will set success to true and pass the following data
 *  1. storesNames: all the stores reamining
 *  2. msg: a prompt to display
 * All of the above are data I think the client side would need to continue.
 */
export const deleteStore = async (req, res) => {
    try {
        const userId = req.body.userId;
        const storeName = req.body.userId;
        // find the user
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found, please try again"
            })
        }
        // detrmine if the store exists
        const existingStore = user.stores.some(store => store.name === storeName);
        if (!existingStore) {
            return res.status(400).json({
                success: false,
                error: "Could not find the store, try again"
            });
        }
        const isMainStore = user.stores.find((s) => s._id === user.mainStore);
        const numOfStores = user.stores.length;
        const storeId = existingStore._id;
        // delete all the reports
        await Report.deleteMany({ store: storeId });
        // update the user
        await User.findByIdAndUpdate(storeId, { $pull: { stores: storeId } });
        // if main store
        if (isMainStore) {
            user.set("mainStore", user.stores[0])
            await user.save();
        }
        const storesNames = user.stores.map((s) => s.name);
        return res.status(200).json({
            success: true,
            storesNames: storesNames,
            msg: "Store removed successfuly"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Failed to add a new store, try again later."
        })
    }
}




