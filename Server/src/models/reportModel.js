import mongoose from "mongoose";
const Schema = mongoose.Schema;
import hourlyReportSchema from "./hourlyReportModel.js";
import Store from "./storeModel.js";

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

/**
 * Middleware to handle the deletion of a single report.
 * It removes it from the reports array in the related store
 */
reportSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Store.findOneAndUpdate(
            doc.store,
            {$pull: { reports: doc._id}}
        )
    }
})

const Report = mongoose.model('Report', reportSchema);
export default Report;