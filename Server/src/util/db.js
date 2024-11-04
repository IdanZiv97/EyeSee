/**
 * File to initlize the database connection
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
console.log("URL: " + process.env.MONGO_URI);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit with failure
    }
};


export default connectDB;


