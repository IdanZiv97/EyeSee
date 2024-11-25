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
    return {date: date, data: avgDwellTime};
}

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
    const reports = await Report.find({store: storeId}).sort({ date: -1}).limit(7);
    // calculate for each report day its dwell time
    const data = reports.map((rep) => calcualteAvgDwellTime(rep))
    return res.status(200).json({
        success: true,
        data: data
    })
    } catch(error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}