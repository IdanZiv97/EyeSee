import mongoose from "mongoose";
const Schema = mongoose.Schema;

const hourlyReportSchema = new Schema({
    // the hours
    timeSlice: {type: String},
    // total number of customers
    totalCustomers: {type: Number},
    // numbers by gender
    totalMaleCustomers: {type: Number},
    totalFemaleCustomers: {type: Number},
    // numbers by age group
    customersByAge: {type: Map, of: Number},
},{timestamps: true});

export default hourlyReportSchema;