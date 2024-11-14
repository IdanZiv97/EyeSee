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
        const isMatch = await bcrypt.compare(user.password, password);
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
