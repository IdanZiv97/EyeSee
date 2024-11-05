import mongoose from "mongoose";
import User from '../models/userModel.js';
import Store from '../models/storeModel.js'

/**
 * This method handels the creating of a new store.
 * If it is a new signup then the main store would be empty and we will need to update it.
 * Otherwise we just need to push the new store to the refs array.
 * @returns http codes with messages
 */
export const createStore = async (req, res) => {
    // get from the body of the request the params for the store
    const userId = req.body.userId;
    const storeName = req.body.storeName;
    console.log("id: " + userId + "\nstoreName: " + storeName);
    
    // get the user
    console.log("qurey user");
    const user = await User.findById(userId).populate('stores');
    if (!user) {
        return res.status(400).json({
            error: "User not found, please try again"
        })
    }
    // given userId
    const existingStore = user.stores.some(store => store.name === storeName);
    console.log(existingStore);
    if (existingStore) {
        return res.status(400).json({ error: "Store with the same name already exists, choose another name" });
    }
    // Creating the new store
    const newStore = new Store({name: storeName, owner: userId});
    await newStore.save();
    // TODO: need to handle errors saving the store
    if (user.mainStore === null) {
        console.log("no main store");
        user.set("mainStore", newStore._id);
    }
    console.log("adding the store");
    user.stores.push(newStore._id);
    await user.save()
    res.status(201).json({storeId: newStore._id, msg: "Store added succesfully."});
};




