/**
 * The server is not responsible for actual upload of the meida.
 * It is merely a managing tool of the process.
 * The actual upload 
 */
import uuidv4 from 'uuid';
import fetch from 'node-fetch';
import User from "../models/userModel.js"
import Report from '../models/reportModel.js';
import { Job } from '../models/jobModel.js';
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
            const jobs = await Job.find({user: userId});
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

// Read Operations

// Delete Operations