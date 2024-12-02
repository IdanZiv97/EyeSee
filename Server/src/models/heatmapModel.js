import mongoose from "mongoose";
const Schema = mongoose.Schema;
const heatmapSchema = new Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    date: { type: Date, required: true, index: true },
    timeSlice: { type: String, required: true },
    url: { type: String, required: true }
}, {timestamps: true});

export const Heatmap = mongoose.model('Heatmap', heatmapSchema);
