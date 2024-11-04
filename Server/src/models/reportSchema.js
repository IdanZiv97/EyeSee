import mongoose from "mongoose";
const Schema = mongoose.Schema;
import hourlyReportSchema from "./hourlyReportModel";

const reportSchema = new Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    hourlyReports: {
        type: [hourlyReportSchema],
        validate: {
            validator: {function(v) {
                return v.length <= 24;
            }},
            message: 'Error: to many reports'
        }
    }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;