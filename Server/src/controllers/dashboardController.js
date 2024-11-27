import mongoose from "mongoose";
import User from "../models/userModel.js"
import Store from "../models/storeModel.js"
import Report from "../models/reportModel.js"

// Helper fucntions:

/**
 * This function gets a report and calculate the average dwell time for that date
 * @param {} report 
 */
function calcualteAvgDwellTime(report) {
    const date = report.date.toISOString().split('T')[0];
    const hourlyReports = [...report.hourlyReports];
    var avgDwellTime = hourlyReports.reduce(
        (totalAvgTime, hourlyReport) => totalAvgTime + hourlyReport.avgDwellTime, 0);
    avgDwellTime = avgDwellTime / hourlyReports.length;
    return { date: date, data: avgDwellTime };
}

/**
 * This functio calcualtes the total number of customers in the past week
 */
function calcualteTotalCustomers(report) {
    const date = report.date.toISOString().split('T')[0];
    const hourlyReports = [...report.hourlyReports];
    const totalCustomers = hourlyReports.reduce(
        (sum , hourlyReport) => sum + hourlyReport.totalCustomers, 0);
    return {date: date, data: totalCustomers};
}

/*************** API  ***************/

/**
 * This function creates 
 * @param {*} req 
 * @param {*} res 
 */
export const getAverageDwellTimeWeekly = async (req, res) => {
    // get userId and store name
    try {
        const userId = req.body.userId;
        const storeName = req.body.storeName;
        // get user
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Couldn't find user, try again."
            })
        }
        // check for the store in the user
        const store = user.stores.find((s) => s.name === storeName);
        if (!store) {
            return res.status(400).json({
                success: false,
                msg: "Couldn't find store, try again"
            })
        }
        // get the last 7 days worth of reports
        const storeId = store._id;
        const reports = await Report.find({ store: storeId }).sort({ date: -1 }).limit(7);
        // calculate for each report day its dwell time
        const data = reports.map((rep) => calcualteAvgDwellTime(rep))
        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

export const getAverageDwellTimeMonthly = async (req, res) => {
    try {
        const userId = req.body.userId;
        const storeName = req.body.storeName;
        // get user
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Couldn't find user, try again."
            })
        }
        // check for the store in the user
        const store = user.stores.find((s) => s.name === storeName);
        if (!store) {
            return res.status(400).json({
                success: false,
                msg: "Couldn't find store, try again"
            })
        }
        // Get the current date, in order to calcualte the date a year ago
        const today = new Date();
        // Calcualte the date of exactly one year ago
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        lastYear.setHours(0, 0, 0, 0); // in case the oldest report was created after 00:00:00
        const storeId = store._id;
        // Aggregate the data
        const reports = await Report.aggregate([
            // Match reports from the specific store and within the last year
            {
                $match: {
                    store: storeId,
                    date: { $gte: lastYear },
                },
            },
            // Unwind the hourlyReports array
            { $unwind: "$hourlyReports" },
            // Group by year and month
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                    avgDwellTime: { $avg: "$hourlyReports.avgDwellTime" },
                },
            },
            // Format the output
            {
                $project: {
                    _id: 0,
                    date: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" },
                                },
                            },
                        ],
                    },
                    avgDwellTime: 1,
                },
            },
            // Sort by date (optional)
            { $sort: { date: 1 } },
        ]);
        const data = reports.map((rep) => ({ date: rep.date, avgDwellTime: rep.avgDwellTime }));
        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

export const getMonthlyTotalCustomers = async (req, res) => {
    try {
        const userId = req.body.userId;
        const storeName = req.body.storeName;
        // get user
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Couldn't find user, try again."
            })
        }
        // check for the store in the user
        const store = user.stores.find((s) => s.name === storeName);
        if (!store) {
            return res.status(400).json({
                success: false,
                msg: "Couldn't find store, try again"
            })
        }
        // Get the current date, in order to calcualte the date a year ago
        const today = new Date();
        // Calcualte the date of exactly one year ago
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        lastYear.setHours(0, 0, 0, 0); // in case the oldest report was created after 00:00:00
        const storeId = store._id;
        // Aggregate
        const reports = await Report.aggregate([
            {
                $match: {
                    store: storeId,
                    date: { $gte: lastYear },
                }
            },
            { $unwind: "$hourlyReports" },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    totalCustomers: { $sum: "$hourlyReports.totalCustomers" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            {
                                $cond: {
                                    if: { $lt: ["$_id.month", 10] },
                                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                                    else: { $toString: "$_id.month" }
                                }
                            }
                        ]
                    },
                    totalCustomers: 1
                }
            },
            { $sort: { date: 1 } }
        ])
        const data = reports.map((rep) => ({ date: rep.date, totalCustomers: rep.totalCustomers }))
        return res.json({
            success: true,
            data: data
        })
    } catch (error) {
        console.error('Error:', error);

    }
}

export const getWeeklyTotalCustomers = async (req, res) => {
    try {

        const userId = req.body.userId;
        const storeName = req.body.storeName;
        // get user
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Couldn't find user, try again."
            })
        }
        // check for the store in the user
        const store = user.stores.find((s) => s.name === storeName);
        if (!store) {
            return res.status(400).json({
                success: false,
                msg: "Couldn't find store, try again"
            })
        }
        // get the last 7 days worth of reports
        const storeId = store._id;
        const reports = await Report.find({ store: storeId }).sort({ date: -1 }).limit(7);
        const data = reports.map((rep) => calcualteTotalCustomers(rep));
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error:', error);
        
    }
}