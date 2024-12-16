import mongoose from "mongoose";
import User from "../models/userModel.js";
import Store from "../models/storeModel.js";
import Report from "../models/reportModel.js"
import { Job as Job } from "../models/jobModel.js"
import { extractPublicId } from "cloudinary-build-url";
import {v2 as cloudinary} from 'cloudinary';
// Helper functions

/**
 * This method breaks apart each hourly report to an object you can print and have easy access to the data.
 * The return valui is a dictionary with two keys:
 *  1. reportId: the id of the report
 *  2. hourlyReports: an array of transformed reports, as specified below.
 * Each hourly report is a JSON with the following keys:
 *  1. date: The date of the report, in 'YYYY-MM-DD' format
 *  2. slice: The hour in the day, in 'HH:00-HH:00' format
 *  3. total: the total customers that were in the shop in that time slice
 *  4. male+female: the portion of the total customers by gender
 *  5. avgDwellTime: the average time (in minutes) that a customer spent in the store in a given hour
 *  6. age classes: each age group has its own entry.
 */
function processReport(report) {
    const date = report.date.toISOString().substring(0, 10);
    const reportId = report._id;
    const subReports = [...report.hourlyReports];
    const transformedReports = subReports.map(hourlyReport => ({
        date: date, // Replace with actual date if needed
        slice: hourlyReport.timeSlice, // Assuming slice is a property in hourlyReport
        total: hourlyReport.totalCustomers || 0, // Default to 0 if not present
        male: hourlyReport.totalMaleCustomers || 0,
        female: hourlyReport.totalFemaleCustomers || 0,
        avgDwellTime: hourlyReport.avgDwellTime || 0,
        'young': hourlyReport.customersByAge?.get('young') || 0,
        'children': hourlyReport.customersByAge?.get('children') || 0,
        'adult': hourlyReport.customersByAge?.get('adult') || 0,
        'elder': hourlyReport.customersByAge?.get('elder') || 0,
    }));
    const response = { reportId: reportId, hourlyReports: transformedReports };
    return response;
}

// Create Operations

/**
 * This method is meant to be invoked by the ML service
 * Waiting for the ML service to be operational
 * @returns 
 */
export const createReport = async (req, res) => {
    const jobId = req.body.jobId;
    const subReports = [...req.body.reports];
    const job = await Job.findOne({ jobId: jobId });
    const userId = job.userId;
    const user = await User.findById(userId).populate('stores');
    const storeName = job.storeName;
    const date = job.date;
    const store = user.stores.find((s) => s.name === storeName);
    if (!store) {
        return res.status(400).json({
            error: "Store not found, try again"
        })
    }
    // given storeId.
    const report = new Report({
        store: store._id,
        hourlyReports: subReports,
        date: date
    })
    await report.save();
    store.reports.push(report._id);
    await store.save();
    // Delete the video
    const url = job.url;
    const publicId = extractPublicId(url);
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    if (!(job.status === "Completed")) {
        job.set("status", "Completed");
        await job.save();
    }
    return res.status(200).json({ msg: "Report was added sucssesfuly", reportId: report._id });
    // TODO: update the client side with a trigger
}

// Read Operations

/**
 * This request handles the default query of a user.
 * When a user logs to the website and navigate to reports, it automatically fetches the most
 * recent report of his defined main store.
 * The request includes the user's id.
 * The response includes the data of the most recent report, as described in the Report schema.
 * The format of the data is a specified in the documentation of processReport function.
 */
export const defaultReport = async (req, res) => {
    const userId = req.body.userId;
    const storeName = req.body.storeName;
    // fetch the user
    const user = await User.findById(userId).populate('stores');
    if (!user) {
        return res.status(400).json({
            success: false,
            msg: "User not found"
        })
    }
    const store = user.stores.find((s) => s.name === storeName);
    if (!store) {
        return res.status(400).json({
            success: false,
            msg: "Store not found"
        })
    }
    const storeId = store._id;
    // search in reports collection by store_id
    const report = await Report.findOne({ store: storeId }).sort({ date: -1 }).limit(1);
    if (!report) {
        return res.status(200).json({
            success: false,
            msg: "No reports found"
        })
    }
    const data = processReport(report);
    res.status(200).json({
        success: true,
        data: data
    });
};


/**
 * Function to handle querying reports by given date(s)
 * The user should pass the following information:
 *  1. userId
 *  2. storeName
 *  3. start: date of the format YYYY-MM-DD
 *  4. end: date of the format YYYY-MM-DD
 *     Note: make sure that the start date is earlier than end date!
 * @returns
 * The function returns an array of dictionaries (javascript objects).
 * Each dictionary has two keys
 *  1. reportId: the id of the report
 *  2. hourlyReports: an array of the reports hourly reports. the structure of each report is as specified
 *      in the documentation of processReport function.
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

/**
 * This function handles qureying the reports only by the wanted gender.
 * In order to handle the request the client side should provide the following information:
 * 1. gender: one the following string ['male', 'female'] and the function will handle the choice
 * 2. userId
 * 3. storen name
 * 4. start and and end date of form YYYY-MM-DD exactly. Make sure that start date is earlier than end date!!
 * @returns the response includes an array of reports (if exists).
 * Each entry is a report document that answer the query parameters
 * Each entry in the array is a dictionary with the following keys:
 *  1. _id: the report id, useful for later opertaions (e.g delete the report)
 *  2. date: the date of the report
 *  3. hourlyReports: of dictionaries, each has a time slice and the amount of customers
 * 
 * Based on this structure of the response further processing of the data is available.
 */
export const qureyReportByGender = async (req, res) => {
    const gender = req.body.gender;
    const userId = req.body.userId;
    const storeName = req.body.storeName;
    const date1 = req.body.start;
    const date2 = req.body.end;
    // get the store id
    const user = await User.findById(userId).populate('stores')
    if (!user) {
        return res.status(400).json({
            success: false,
            msg: "User not found"
        })
    }
    const store = user.stores.find((s) => s.name === storeName);
    if (!store) {
        return res.status(400).json({
            success: false,
            msg: "Store not found"
        })
    }
    const storeId = store._id;
    // created the dates range
    const start = date1 + 'T00:00:00.000Z';
    const end = date2 + 'T23:59:59.999Z';
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Get all the reports you need by the store
    const selectedField = gender === 'male' ? 'totalMaleCustomers' : 'totalFemaleCustomers';
    const reports = await Report.aggregate([
        {
            $match: {
                store: storeId,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $project: {
                _id: 1,
                date: 1,
                hourlyReports: {
                    timeSlice: 1,
                    [selectedField]: 1
                }
            }
        }
    ])
    if (reports.length === 0) {
        return res.status(200).json({
            success: false,
            msg: "No reports found"
        })
    }
    return res.status(200).json(reports);
}

export const qureyReportByAges = async (req, res) => {
    const userId = req.body.userId;
    const storeName = req.body.storeName;
    const date1 = req.body.start;
    const date2 = req.body.end;
    // get the store id
    const user = await User.findById(userId).populate('stores')
    if (!user) {
        return res.status(400).json({
            success: false,
            msg: "User not found"
        })
    }
    const store = user.stores.find((s) => s.name === storeName);
    if (!store) {
        return res.status(400).json({
            success: false,
            msg: "Store not found"
        })
    }
    const storeId = store._id;
    // created the dates range
    const start = date1 + 'T00:00:00.000Z';
    const end = date2 + 'T23:59:59.999Z';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const reports = await Report.aggregate([
        {
            $match: {
                store: storeId,
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $project: {
                _id: 1,
                date: 1,
                hourlyReports: {
                    timeSlice: 1,
                    customersByAge: 1
                }
            }
        }
    ])
    if (reports.length === 0) {
        return res.status(200).json({
            success: false,
            msg: "No reports found"
        })
    }
    return res.status(200).json(reports);
}

// Delete Operations
/**
 * This function handles the delete request given id of the requested report.
 * A report should be delete from the reports collection and also from the relevant store.
 * The function return a success message with proper msg regarding any success or failure
 * @returns 
 */
export const deleteReport = async (req, res) => {
    // I assume that the user sends report id that it is from its own store
    try {
        const reportId = req.body.reportId;
        // Find the reprot
        const requestedReport = await Report.findById(reportId);
        if (!requestedReport) {
            return res.status(400).json({
                success: false,
                msg: "Report not found"
            })
        }
        // delete the report
        const deletedReport = await Report.findOneAndDelete({ _id: requestedReport._id });
        if (!deletedReport) {
            return res.status(400).json({
                success: false,
                msg: "Failed to find the requested report"
            })
        }
        return res.status(200).json({
            success: true,
            msg: "Report deleted successfuly"
        })
    } catch (error) {
        console.log("Failed to delete report: ", error);
        return res.status(400).json({
            success: false,
            msg: "An error occurred while deleting the report. Try again later"
        });
    }
    // perform the delete command
}
/**
 * This function handles the delete operation.
 * It receives an array of strings: the id of the reports.
 * It returns a success status and a proper message
 */
export const deleteReports = async (req, res) => {
    // get the reports
    const reportsIds = req.body.reportsIds;
    // check for valid foramt
    if (!Array.isArray(reportsIds) || reportsIds.length < 1) {
        return res.status(400).json({
            success: false,
            msg: "Please pass a valid array of IDs"
        });
    }
    // find all the reports
    var failedToDelete = [];
    var missingFlag = false;
    var failureFlag = false;
    for (const reportId of reportsIds) {
        try {
            const requestedReport = await Report.findById(reportId);
            if (!requestedReport) {
                const temp = {
                    reportId: reportId,
                    error: "Could not find report"
                }
                if (!missingFlag) { missingFlag = true; }
                failedToDelete.push(temp);
                continue;
            }
            const deletedReport = await Report.findOneAndDelete({ _id: requestedReport._id });
        } catch (error) {
            const temp = {
                reprotId: reportId,
                error: "Failed to delete report"
            }
            if (!failureFlag) { failureFlag = true; }
            failedToDelete.push(temp);
        }
    }
    if (failedToDelete.length === 0) {
        return res.status(200).json({
            success: true,
            missingReports: missingFlag,
            failureToDelete: failureFlag,
            reports: failedToDelete
        })
    } else {
        return res.status(400).json({
            success: false,
            missingReports: missingFlag,
            failureToDelete: failureFlag,
            reports: failedToDelete
        })
    }
}