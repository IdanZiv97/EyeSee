/**
 * The server is not responsible for actual upload of the meida.
 * It is merely a managing tool of the process.
 * The actual upload 
 */
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import User from "../models/userModel.js"
import Report from '../models/reportModel.js';
import { Job } from '../models/jobModel.js';
import { Heatmap } from '../models/heatmapModel.js';

// Configuring cloudinary access
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url' // open-source package to extract publicId from url
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload Operations

export const uploadVideo = async (req, res) => {
    try {
        // get the params agreed upon
        const { userId, storeName, date, url, startTime, endTime, length } = req.body;
        // check for valid username and store
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Error: couldn't find the user, try again"
            }
            );
        }
        const store = user.stores.find((s) => s.name === storeName);
        if (!store) {
            return res.status(400).json({
                success: false,
                msg: "Error: couldn't find the user, try again"
            });
        }
        // check if an existing report on that date exists
        const start = date + 'T00:00:00.000Z';
        const end = date + 'T23:59:59.999Z';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const existingReport = await Report.find({ store: store._id, date: { $gte: startDate, $lte: endDate } });
        if (existingReport) {
            return res.status(400).json({
                success: false,
                msg: "A report for that date already exists, check for a correct store/date"
            })
        }
        // all checks are valid: we can create a job
        const jobId = uuidv4();
        const newJob = new Job({
            jobId: jobId,
            userId: userId,
            storeName: store.name,
            date: startDate,
            url: url,
            startTime: startTime,
            endTime: endTime,
            length: length,
            status: "Pending"
        })
        await newJob.save();
        // try to send the request
        const mlServiceResponse = await fetch('http://mlServiceURL/video-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobId: newJob.jobId,
                start: newJob.startTime,
                end: newJob.endTime,
                length: newJob.length
            }),
        });
        // TODO: handle the case where the ML serivce failed to recive the link. loop to try again.
        if (mlServiceResponse.ok) {
            newJob.set('status', "Processing");
            await newJob.save();
            // fetch user's jobs
            const jobs = await Job.find({ user: userId });
            return res.status(200).json({
                success: true,
                msg: "Video uploaded successfuly.",
                newJobId: jobId,
                jobs: jobs
            });
        } else {
            newJob.set('status', "Failed");
            await newJob.save();
            // fetch user's jobs
            const jobs = await Job.find({ user: userId });
            return res.status(400).json({
                success: false,
                msg: "Failed to send the video URL to AI service, try again later",
                newJobId: jobId,
                jobs: jobs
            })
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            msg: "Internal error, try again."
        });
    }
}

/**
 * Function to upload a heatmap.
 * Note: this method is called only by the ML Service!
 * Under the assumption we upload a heatmap for every time slice in the video given to the ML service.
 * In order to create the heatmap the ML service will pass on in the body of the request:
 *  1. jobId
 *  2. timeSlice
 *  3. link: the url to the uploaded image on the cloud
 * 
 */

export const addHeatmap = async (req, res) => {
    // get the params
    const jobId = req.body.jobId;
    const link = req.body.link;
    // get the job
    const job = await Job.findById(jobId);
    // double check the status is processing
    if (!job.status === "Processing") {
        job.set('status', "Processing");
        await job.save();
    }
    // create the heatmap
    const user = await User.findById(job.userId).populate('store');
    const store = user.stores.find((s) => s.name === job.storeName);
    try {
        const newHeatmap = new Heatmap({
            store: store._id,
            date: job.date,
            url: link,
        });
        await newHeatmap.save();
        return res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(400).json({
            success: false
        })
    }

}

// Read Operations

/**
 * Function that the client uses to recive the most recent heatmap link
 * This function receives the following information:
 *  1. userId: to handle the store search
 *  2. storeName: to fetch the store's id from the database
 * The most recent report is by date, the latest, and by time slice.
 * Since the time slice is a string of the format "HH:00-HH:00" we can sort it lexicographically.
 * In case of an error the 'success' field will be set to false with a proper message, as described in the code.
 * In case of a match, the 'success' field will be set ot true and the following data will be passed in the response:
 *  1. date: the date of the heatmap
 *  2. link: the url from which the client code can download the image.
 */

export const getRecentHeatmap = async (req, res) => {
    try {
        // get the params from the request
        const userId = req.body.userId;
        const storeName = req.body.storeName;
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "User not found, try again later."
            })
        }
        // find the stores id
        const store = user.stores.find((s) => s.name === storeName);
        if (!store) {
            return res.status(400).json({
                success: false,
                msg: "Store not found, try again later"
            })
        }
        const storeId = store._id;
        // find the most recent heatmap
        const heatmap = await Heatmap.findOne({ store: storeId })
            .sort({ date: -1 });
        if (!heatmap) {
            return res.status(400).json({
                success: false,
                msg: "No heatmap was found for this store."
            })
        }
        return res.status(200).json({
            success: true,
            date: heatmap.date,
            link: heatmap.url
        })
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error, try again"
        })
    }
}

/**
 * Function that fetches all the heatmaps of a store from a given time span.
 * The function receives in the request's body the following data:
 *  1. userId
 *  2. storeName
 *  3. startDate: a date in the format YYYY-MM-DD, the start date of the time span
 *  4. endDate: a date in the format YYYY-MM-DD, the end date of the time span
 * Note: the startDate should be earlier than the end date
 * Note: For a time span of a day set the startDate and endDate to the same 
 * * In case of an error the 'success' field will be set to false with a proper message, as described in the code.
 * In case of a match, the 'success' field will be set ot true and the following data will be passed in the response:
 *  1. heatmaps: an array of json each with the following filed:
 *      1.1 slug: a string of the format "YYYY-MM-DD" to indicate the time stamp of the heatmap.
 *      1.2 url: the link for downloading the image
 *      1.3 _id: the heatmap id, useful for later usage
 */

export const getHeatmaps = async (req, res) => {
    try {
        // get parans
        const userId = req.body.userId;
        const storeName = req.body.storeName;
        const date1 = req.body.startDate;
        const date2 = req.body.endDate;
        // serach the user
        const user = await User.findById(userId).populate('stores');
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "User not found, try again later."
            })
        }
        const store = user.stores.find((s) => s.name === storeName);
        if (!store) {
            return res.status(400).json({
                succes: false,
                msg: "Store not found, try again later."
            })
        }
        const storeId = store._id;
        // create the time span
        const start = date1 + 'T00:00:00.000Z';
        const end = date2 + 'T23:59:59.999Z';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const heatmaps = await Heatmap.aggregate([
            {
                $match: {
                    store: storeId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $addFields: {
                    slug: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                }
            },
            {
                $project: {
                    _id: 1,
                    slug: 1,
                    url: 1
                }
            }
        ]);
        const length = heatmaps.length;
        if (length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No heatamps found for given time span."
            })
        }
        return res.status(200).json({
            success: true,
            heatmaps: heatmaps
        })
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error, try again"
        })
    }
}

// Delete Operations

/**
 * This function handles the deleteion of the a heatmap image from the cloud.
 * It required an heatmapId. It will receive the ids in an array.
 * In case of a failure the success field will be set to false.
 * In case of failed delete operations, an array of the failed heatmaps Ids will be sent with proper message
 */

export const deleteHeatmaps = async (req, res) => {
    const heatmapsIds = req.body.ids;
    if (!Array.isArray(heatmapsIds)) {
        return res.status(400).json({
            success: false,
            msg: "Please pass a valid array of IDs"
        });
    }
    var failedToDelete = [];
    var failureFlag = false;
    for (const heatmapId of heatmapsIds) {
        try {
            const heatmap = await Heatmap.findById(heatmapId);
            if (!heatmap) {
                const temp = {
                    heatmapId: heatmapId,
                    error: "Couldn't find heatmap"
                }
                if (!failureFlag) { failureFlag = true; }
                failedToDelete.push(temp)
            }
            // get the public id
            const publicId = extractPublicId(heatmap.url);
            // delete from cloud
            const isDeleted = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            // handle error delete
            if (!(isDeleted.result === "ok")) {
                const temp = {
                    heatmapId: heatmapId,
                    error: "Failed to delete the report , try again"
                }
                if (!failureFlag) { failureFlag = true; }
                failedToDelete.push(temp)
            }
            // delete from the server
            await Heatmap.findByIdAndDelete(heatmapId);
        } catch (error) {
            console.error('Error: ', error);
            const temp = {
                heatmapId: heatmapId,
                error: error
            }
        }
    }
    if (failedToDelete.length === 0) {
        return res.status(200).json({
            success: true,
            failureFlag: failureFlag,
            heatmaps: failedToDelete
        })
    } else {
        return res.status(400).json({
            success: false,
            failureFlag: failureFlag,
            heatmaps: failedToDelete
        })
    }
}

/**
 * Function to delete a video.
 * Note: This method is called only by the ML service!
 * The body of the request will include only the  jobId
 * A video will remain saved on the cloud until the job is completed.
 * Once the job is completed we will delete the video.
 * The response will be success with value 'true' or 'false' if the video is deleted or not, respectively.
 */

export const deleteVideo = async (req, res) => {
    // get the params
    const jobId = req.body.jobId;
    // fetch the job
    const job = await Job.findById(jobId);
    if (job.status === "Completed") {
        return res.status(200).json({
            success: true,
        })
    }
    // handle the deletion of the video
    const url = job.url;
    try {
        const publicId = extractPublicId(url);
        const response = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        if (!(response.result === "ok")) {
            return res.status(400).json({
                success: false,
            })
        }
        job.set('status', "Completed");
        await job.save();
        return res.status(200).json({
            success: true,
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
        })
    }
}