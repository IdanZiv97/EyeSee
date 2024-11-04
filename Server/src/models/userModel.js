import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
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
        required: true,
    },
    stores: [{type: mongoose.Schema.Types.ObjectId, ref: 'Store'}]


}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;