import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mainStore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
    },
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }]


}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;