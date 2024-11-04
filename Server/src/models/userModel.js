import mongoose from "mongoose";
const types = mongoose.SchemaTypes;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: types.String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: types.String,
        required: true,
    },
    email: {
        type: types.String,
        required: true,
        unique: true,
    },
    // placeholder for main store
    // placeholder for stores array
});