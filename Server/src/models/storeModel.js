import mongoose from "mongoose";
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: { type: ObjectId, ref: "User", required: true },
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
    }],
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;