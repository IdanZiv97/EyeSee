import mongoose from "mongoose";
import User from "../models/userModel.js";
import Store from "../models/storeModel.js";
import Report from "../models/reportModel.js"

// Helper functions

/**
 * This method breaks apart each hourly report to an object you can print and look
 */
function processReport(report) {
    const date = report.date;
    const subReports = [...report.hourlyReports];
    const transformedReports = subReports.map(hourlyReport => ({
        date: date, // Replace with actual date if needed
        slice: hourlyReport.timeSlice, // Assuming slice is a property in hourlyReport
        total: hourlyReport.totalCustomers || 0, // Default to 0 if not present
        male: hourlyReport.totalMaleCustomers || 0,
        female: hourlyReport.totalFemaleCustomers || 0,
        ages: {
            '0-9': hourlyReport.customersByAge?.['0-9'] || 0,
            '10-19': hourlyReport.customersByAge?.['10-19'] || 0,
            '20-29': hourlyReport.customersByAge?.['20-29'] || 0,
            '30-39': hourlyReport.customersByAge?.['30-39'] || 0,
            '40-49': hourlyReport.customersByAge?.['40-49'] || 0,
            '50-59': hourlyReport.customersByAge?.['50-59'] || 0,
            '60+': hourlyReport.customersByAge?.['60+'] || 0,
        }
    }));
    return transformedReports;
    // const response = [];

    // const test = subReports[0];
    // const slice = test.timeSlice;
    // const total = test.totalCustomers;
    // const male = test.totalMaleCustomers;
    // const female = test.totalFemaleCustomers;
    // const customersByAge = test.customersByAge;
    // return {
    //     date: date,
    //     slice: slice,
    //     total: total,
    //     male: male,
    //     female: female,
    //     ages: customersByAge
    // };
}

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
    const store = user.stores.find((s) => s.name === storeName);
    if (!store) {
        return res.status(400).json({
            success: false,
            msg: "Store not found"
        })
    }
    // search the date
    const storeId = store._id;
    const start = date + 'T00:00:00.000Z'; // creating the proper range
    const end = date + 'T23:59:59.999Z';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const report = await Report.findOne({
        store: storeId,
        date: { $gte: startDate, $lte: endDate }
    });
    if (!report) {
        return res.status(200).json({
            success: false,
            msg: "No matching report for the requested date."
        })
    }
    const data = report.hourlyReports.map((rep) => rep);
    return res.status(200).json(data);
};

/**
 * Same as qureying by a specific date but now the range is from a given date
 * The user should pass the following information:
 *  1. user_id
 *  2. store name
 *  3. dates = an array of a strings describing the time range in YYYY-MM-DD format
 */

export const qureyReportByDates = async (req, res) => {
    const userId = req.body.userId;
    const storeName = req.body.storeName;
    const date1 = req.body.start;
    const date2 = req.body.end;
    // search for the user
    const user = await User.findById(userId).populate('stores')
    if (!user) {
        return res.status(400).json({
            success: false,
            msg: "User not found"
        })
    }
    // search for the store
    const store = user.stores.find((s) => s.name === storeName);
    if (!store) {
        return res.status(400).json({
            success: false,
            msg: "Store not found"
        })
    }
    // created the dates range
    const start = date1 + 'T00:00:00.000Z';
    const end = date2 + 'T23:59:59.999Z';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const storeId = store._id;
    // Perform the qurey
    const reports = await Report.find({
        store: storeId,
        date: { $gte: startDate, $lte: endDate }
    });
    if (reports.length === 0) {
        return res.status(200).json({
            success: false,
            msg: "No reports found"
        })
    }
    const data = reports.flatMap((report) => processReport(report));
    return res.status(200).json(data);
}