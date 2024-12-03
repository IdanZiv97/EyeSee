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

/**
 * Function to update the user info
 * The request body includes:
 *  1. username
 *  2. firstName
 *  3. lastName
 *  4. email
 *  5. mainStore: if it fancy to change its main store
 *  6. userId: to identify
 * If a field of the user is not being changed it will not be sent in the repsonse and will hold the value of undefined
 */

export const updateUserInfo = async (req, res) => {
    // get params
    try {
        const userId = req.body.userId;
        const username = req.body.username;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const mainStore = req.body.mainStore;
        // save updates
        var updates = {};
        // get user
        const user = await User.findById(userId).populate('stores').populate('mainStore');
        // handle possible username changed
        if (username && !(username === user.username)) {
            // check if username is already taken
            const isUsernameTaken = await User.findOne({ username: username });
            if (isUsernameTaken) {
                return res.status(400).json({
                    message: "Username already taken!",
                    updatedUser: null,
                })
            }
            updates.username = username;
        }
        if (email && !(email === user.email)) {
            // check if email is already taken
            const isEmailTaken = await User.findOne({ email: email });
            if (isEmailTaken) {
                return res.status(400).json({
                    message: "Email is already taken"
                })
            }
            updates.email = email;
        }
        if (mainStore && !(mainStore === user.mainStore.name)) {
            // check if the input store name is a name of an existing store
            const isValidStoreName = user.stores.some((s) => s.name === mainStore);
            if (!isValidStoreName) {
                return res.status(400).json({
                    message: "New store name must be a name of an existing store"
                })
            }
            const newMainStore = user.stores.find((s) => s.name === mainStore);
            updates.mainStore = newMainStore._id;
        }
        if (firstName) {
            updates.firstName = firstName;
        }
        if (lastName) {
            updates.lastName = lastName;
        }
        // check if no updates were made
        if (Object.keys(updates).length === 0) {
            return res.status(200).json({
                message: "No updates detected, user not updated"
            })
        }
        // update the user
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).populate('mainStore');
        return res.status(200).json({
            message: "User updated successfuly",
            updatedUser: {
                userId: userId,
                username: updatedUser.username,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                mainStore: updatedUser.mainStore.name
            }
        })
    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json({
            error: "Iternal Server Error"
        })
    }


}