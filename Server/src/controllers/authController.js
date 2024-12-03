import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from "../models/userModel.js";
import Store from "../models/storeModel.js";

/**
 * function that handles the login process.
 * In order to login the client side should pass the following data in its login request:
 *  1. username
 *  2. password
 * The server checks if the user exists and if the password entred matches the saved password (hashed)
 * Each response has the success field: true iff the login is successful
 * When a login fails, or in case of a server related error, the response includes a proper message.
 * When a login succeeds the response include the following data:
 *  1. id of the logged in user
 *  2. username of the logged in user
 *  3. user info
 *  4. stores info
 */
export const loginUser = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        // check if user exists
        const user = await User.findOne({ username }).populate('stores', 'name');
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
        // find the stores by name and pass them
        const storesNames = user.stores.map((store) => store.name);
        // create the proper response
        res.status(200).json({
            success: true,
            userId: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mainStoreId: user.mainStore,
            stores: storesNames
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Your request could not be processed. Please try again.'
        })
    }
}

/**
 * function that handles the creation of a new user.
 * In order to create a new user the client side must present the following data
 *  1. unique username
 *  2. unique email
 *  3. password
 *  4. first and last name (seperate values)
 *  5. main store name
 * The server checks for the uniquenes of relevant values and returns an error message when needed.
 * Each response has the success field: true iff the sign up is successful
 * When a sign up fails, or in case of a server related error, the response includes a proper message.
 * When a sign up succeeds the response include the following data:
 *  1. id of the signed user
 *  2. username of the signed user
 *  3. user info
 *  4. stores info
 */
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
        res.status(200).json({
            success: true,
            msg: "User registered successfuly",
            userId: newUser._id,
            storeId: newStore._id,
            storeName: newStore.name, // not passing stores name since new user has only one store
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Your request could not be processed. Please try again.'
        })
    }
}