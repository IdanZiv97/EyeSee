import mongoose from "mongoose";
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name: {
        type: String,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
    }],
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
export default Store;