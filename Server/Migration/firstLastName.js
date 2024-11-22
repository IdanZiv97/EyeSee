import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from "../src/models/userModel.js";
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const migrateUsers = async () => {
    try {
        const result = await User.updateMany(
            {}, // Match all documents
            {
                $set: { firstName: "", lastName: "" },
            }
        );
        console.log(`Migration completed. Updated ${result.nModified} documents.`);
        mongoose.connection.close();
    } catch (error) {
        console.error('Migration failed:', error);
        mongoose.connection.close();
    }
};

migrateUsers();
