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
        (sum, hourlyReport) => sum + hourlyReport.totalCustomers, 0);
    return { date: date, data: totalCustomers };
}

/**
 * This function calculates the total number of customers in the past week, by gendner
 */
function calcualteTotalGenderDistribution(report) {
    const date = report.date.toISOString().split('T')[0];
    const hourlyReports = [...report.hourlyReports];
    const totalMaleCustomers = hourlyReports.reduce(
        (sum, hourlyReport) => sum + hourlyReport.totalMaleCustomers, 0);
    const totalFemaleCustomers = hourlyReports.reduce(
        (sum, hourlyReport) => sum + hourlyReport.totalFemaleCustomers, 0);
    return { date: date, distribution: { male: totalMaleCustomers, female: totalFemaleCustomers } };
}

/**
 * This function calculates the difference in given parameter
 */

function calculateDifference(currentValue, prevValue) {
    var difference = currentValue - prevValue;
    const isLoss = difference >= 0 ? false : true;
    difference = Math.abs(difference);
    if (isLoss) {
        const percentage =  parseFloat(((prevValue / currentValue) - 1).toFixed(2));
        return {diff: difference, percentage: percentage, isLoss: isLoss}
    } else {
        const percentage = parseFloat(((currentValue / prevValue) - 1).toFixed(2));
        return {diff: difference, percentage: percentage, isLoss: isLoss}
    }
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
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
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
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

export const getMonthlyTotalGenderDistribution = async (req, res) => {
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
                    totalMaleCustomers: { $sum: "$hourlyReports.totalMaleCustomers" },
                    totalFemaleCustomers: { $sum: "$hourlyReports.totalFemaleCustomers" }
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
                    totalMaleCustomers: 1,
                    totalFemaleCustomers: 1
                }
            },
            { $sort: { date: 1 } }
        ])
        const data = reports.map((rep) => ({
            month: rep.date,
            distribution: {
                male: rep.totalMaleCustomers,
                female: rep.totalFemaleCustomers,
            },
        }))
        return res.json({
            success: true,
            data: data
        })
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

export const getWeeklyTotalGenderDistribution = async (req, res) => {
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
        // procceess the reportts
        const data = reports.map((rep) => calcualteTotalGenderDistribution(rep));
        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Iternal server error'
        })
    }
}

export const getMonthlyTotalAgeDistribution = async (req, res) => {
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
                // Filter reports from the last year for the specified store
                $match: {
                    store: storeId,
                    date: { $gte: lastYear },
                }
            },
            {
                // Unwind the hourlyReports array
                $unwind: "$hourlyReports"
            },
            {
                // Convert the customersByAge map into an array of key-value pairs
                $project: {
                    date: 1,
                    store: 1,
                    hourlyReports: 1,
                    customersByAge: {
                        $objectToArray: "$hourlyReports.customersByAge"
                    }
                }
            },
            {
                // Unwind the array created by objectToArray to access age group data
                $unwind: "$customersByAge"
            },
            {
                // Group by year, month, and age group, summing customers for each age group
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        ageGroup: "$customersByAge.k" // The age group key
                    },
                    totalCustomers: { $sum: "$customersByAge.v" } // Sum the values
                }
            },
            {
                // Restructure the data to group by month and year
                $group: {
                    _id: {
                        year: "$_id.year",
                        month: "$_id.month"
                    },
                    customersByAge: {
                        $push: {
                            ageGroup: "$_id.ageGroup",
                            totalCustomers: "$totalCustomers"
                        }
                    }
                }
            },
            {
                // Format the date as YYYY-MM
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
                    customersByAge: 1
                }
            },
            {
                // Sort by date
                $sort: { date: 1 }
            }
        ]);
        const data = reports.map((rep) => ({ date: rep.date, distribution: rep.customersByAge }));
        // const results = await Report.aggregate([
        //     {
        //         $match: {
        //             store: storeId,
        //             date: { $gte: lastYear },
        //         },
        //     },
        //     { $unwind: "$hourlyReports" },
        //     {
        //         $group: {
        //             _id: {
        //                 date: "$date",
        //             },
        //             customerByAge: {
        //                 $mergeObjects: "$hourlyReports.customersByAge",
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             date: "$_id.date"
        //         },
        //         customersByAge: 1
        //     }
        // ]);
        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Iternal server error'
        })
    }
}

// Analytics

export const getAnalytcis = async (req, res) => {
    // get params
    const userId = req.body.userId;
    const storeName = req.body.storeName;
    // find the user and store
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
    const storeId = store._id;
    // Set the daily intervals
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    // Set the weekly intervals
    const endOfCurrentWeek = new Date();
    const startOfCurrentWeek = new Date(endOfCurrentWeek);
    startOfCurrentWeek.setDate(endOfCurrentWeek.getDate() - 6); // including today
    // previuous week
    const endOfPreviousWeek = new Date(startOfCurrentWeek);
    const startOfPreviousWeek = new Date(endOfPreviousWeek);
    startOfPreviousWeek.setDate(endOfPreviousWeek.getDate() - 7);

    // aggregate the data neccessary
    const todayReport = await Report.aggregate([
        {
            $match: { store: storeId, date: { $gte: new Date(today.setHours(0, 0, 0, 0)), $lte: new Date(today.setHours(23, 59, 59, 59)) } }
        },
        { $unwind: "$hourlyReports" },
        {
            $group: {
                _id: { date: "$date" },
                avgDwellTime: { $avg: "$hourlyReports.avgDwellTime" },
                totalCustomers: { $sum: "$hourlyReports.totalCustomers" },
            },
        }
    ]);
    const yesterdayReport = await Report.aggregate([
        {
            $match: { store: storeId, date: { $gte: new Date(yesterday.setHours(0, 0, 0, 0)), $lte: new Date(yesterday.setHours(23, 59, 59, 59)) } }
        },
        { $unwind: "$hourlyReports" },
        {
            $group: {
                _id: { date: "$date" },
                avgDwellTime: { $avg: "$hourlyReports.avgDwellTime" },
                totalCustomers: { $sum: "$hourlyReports.totalCustomers" },
            }
        }
    ])
    const thisWeek = await Report.aggregate([
        {
            $match: { store: storeId, date: { $gte: new Date(startOfCurrentWeek.setHours(0, 0, 0, 0)), $lte: new Date(endOfCurrentWeek.setHours(23, 59, 59, 59)) } }
        },
        { $unwind: "$hourlyReports" },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                avgDwellTime: { $avg: "$hourlyReports.avgDwellTime" },
                totalCustomers: { $sum: "$hourlyReports.totalCustomers" },
            }
        },
    ]);
    const lastWeek = await Report.aggregate([
        {
            $match: { store: storeId, date: { $gte: new Date(startOfPreviousWeek.setHours(0, 0, 0, 0)), $lte: new Date(endOfPreviousWeek.setHours(23, 59, 59, 59)) } }
        },
        { $unwind: "$hourlyReports" },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                avgDwellTime: { $avg: "$hourlyReports.avgDwellTime" },
                totalCustomers: { $sum: "$hourlyReports.totalCustomers" },
            }
        }
    ]);
    // handle daily comparison
    const dailyTotalCustomerDiff = calculateDifference(todayReport[0].totalCustomers, yesterdayReport[0].totalCustomers);
    const dailyAvgDwellTimeDiff = calculateDifference(todayReport[0].avgDwellTime, yesterdayReport[0].avgDwellTime);
    //handle weekly comparison
    const weeklyTotalCustomersDiff = calculateDifference(thisWeek[0].totalCustomers, lastWeek[0].totalCustomers);
    const weeklyAvgDwellTimeDiff = calculateDifference(thisWeek[0].avgDwellTime, lastWeek[0].avgDwellTime);
    const data = {
        dailyTotal: dailyTotalCustomerDiff,
        dailyDwell: dailyAvgDwellTimeDiff,
        weeklyTotal: weeklyTotalCustomersDiff,
        weeklyDwell: weeklyAvgDwellTimeDiff
    }
    return res.status(200).json({
        success: true,
        data: data
    });
}