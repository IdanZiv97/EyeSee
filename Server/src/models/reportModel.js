import mongoose from "mongoose";
const Schema = mongoose.Schema;
import hourlyReportSchema from "./hourlyReportModel.js";

const reportSchema = new Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
    },
    date: {
        type: mongoose.Schema.Types.Date,
        default: Date.now()
    },
    hourlyReports: {
        type: [hourlyReportSchema]
    },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;