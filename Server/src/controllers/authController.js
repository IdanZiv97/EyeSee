import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from "../models/userModel.js";
import Store from "../models/storeModel.js";

// route to login
export const loginUser = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        // check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Username does not exist"
            })
        }
        // check hash value
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Username and/or password not valid"
            })
        }
        // create the proper response
        res.status(200).json({
            success: true,
            userId: user.id,
            username: user.username,
            mainStoreId: user.mainStore
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Your request could not be processed. Please try again.'
        })
    }
}

export const signupUser = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const firstName = req.body.firstname;
        const lastName = req.body.lastname;
        const email = req.body.email;
        const storeName = req.body.storename;
        // check if the username or email is taken
        const isExistingUser = await User.findOne({$or: [{username: username}, {email: email}]})
        if (isExistingUser) {
            if (isExistingUser.username === username) {
                return res.status(400).json({
                    success: false,
                    msg: "Username is already taken"
                })
            }
            if (isExistingUser.email === email) {
                return res.status(400).json({
                    success: false,
                    msg: "Email is already taken"
                })
            }
        }
        // create the user
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
            email: email,
            mainStore: null,
            stores: []
        })
        await newUser.save();
        // creating the store and creating the reference in the user
        const newStore = new Store({name: storeName, owner: newUser._id})
        await newStore.save();
        newUser.set('mainStore', newStore._id);
        newUser.stores.push(newStore._id);
        await newUser.save();
        res.status(201).json({
            sucess: true,
            msg: "User registered successfuly",
            userId: newUser._id,
            storeId: newStore._id
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Your request could not be processed. Please try again.'
        })
    }
}