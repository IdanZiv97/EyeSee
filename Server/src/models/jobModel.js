import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    jobId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner
    storeName: { type: String }, // The store that the video belongs to
    date: { type: Date }, // the date of the video, the report will have the same date
    url: { type: String }, // where the video is saved
    startTime: { type: String },
    endTime: { type: String },
    length: { type: Number }, // the length of the video
    status: { // The idea here to have some sort of history for the user and for the app to manage
        type: String,
        default: "Pending",
        enum: ["Pending", "Processing", "Completed", "Failed"],
        index: true
    }
});

export const Job = mongoose.model('Job', jobSchema);