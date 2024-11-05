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
    res.status(201).json({msg: "Report was added sucssesfuly", reportId: report._id});
}