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

/**
 * This request handles the default query of a user.
 * When a user logs to the website and navigate to reports, it automatically fetches the most
 * recent report of his its defined main store
 * @param {userId} req 
 * @param {*} res 
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
    const storeId = user.mainStore;
    // search in reports collection by store_id
    const report = await Report.findOne({store: storeId}).sort({date: -1}).limit(1);
    const data = report.hourlyReports.map((rep) => rep);
    console.log(data);
    res.status(200).json(data);
}