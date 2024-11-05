import mongoose from "mongoose";
import User from '../models/userModel.js';

/**
 * This function is called in sign up.
 * We make sure that the password
 * @param {*} req 
 * @param {*} res 
 */
export const createUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const storeName = req.body.storeName;
    // TODO: error handling
    // Check if the username is taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: "Username taken" });
    }
    // Create new User
    // TODO: hashing the password and adding salt.
    const newUser = new User({
        username,
        password,
        email,
        mainStore: null,
        stores: []
    })
    await newUser.save();
    return res.status(201).json({
        msg: "User created succesfuly",
        userId: newUser._id,
    })
}