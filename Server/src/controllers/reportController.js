import mongoose from "mongoose";
import User from "../models/userModel.js";
import Store from "../models/storeModel.js";
import Report from "../models/reportModel.js"


export const createReport = async (req, res) => {
    const storeId = req.body.storeId;
    const subReports = [...req.body.reports];
    const store = await Store.findById(storeId).populate('reports');
    if (!store) {
        return res.status(400).json({
            error: "Store not found, try again"
        })
    }
    // given storeId.
    const report = new Report({
        store: storeId,
        hourlyReports: subReports
    })
    await report.save();
    store.reports.push(report._id);
    await store.save();
    res.status(201).json({ msg: "Report was added sucssesfuly", reportId: report._id });
}

// Read Operations

/**
 * This request handles the default query of a user.
 * When a user logs to the website and navigate to reports, it automatically fetches the most
 * recent report of his its defined main store
 * The request includes the user's id.
 * The response includes the data of the most recent report, as described in the Report schema.
 */
export const defaultReport = async (req, res) => {
    const userId = req.body.userId;
    // fetch the user
    const user = await User.findById(userId).populate('mainStore');
    if (!user) {
        return res.status(400).json({
            success: false,
            msg: "User not found"
        })
    }
    const store = user.mainStore;
    // search in reports collection by store_id
    const report = await Report.findOne({ store: storeId }).sort({ date: -1 }).limit(1);
    const data = report.hourlyReports.map((rep) => rep);
    res.status(200).json(data);
};

/**
 * This method allows us to query the stores reports by date.
 * In order to do so we need to recieve from the client side the following info:
 *  1. user_id: to gather the data related to the user
 *  2. store_id: to get the relevant store
 *  3. date: to get the relvant date
 * @param {} req 
 * @param {*} res 
 */
export const qureyReportByDate = async (req, res) => {
    const userId = req.body.userId;
    const storeName = req.body.storeName;
    const date = req.body.date;
    // check for user
    const user = await User.findById(userId).populate('stores');
    if (!user) {
        return res.status(400).json({
            success: false,
            msg: "User not find one."
        })
    }
    // check for store
    
    // check for proper date format & extract the date
    // check for valid date
};