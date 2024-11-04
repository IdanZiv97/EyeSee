import mongoose from "mongoose";
const Schema = mongoose.Schema;
const hourlyReportSchema = new Schema({
    // the hours
    timeSlice: {type: String, required: true},
    // total number of customers
    totalCustomers: {type: Number, required: true},
    // numbers by gender
    totalMaleCustomers: {type: Number, required: true},
    totalFemaleCustomers: {type: Number, required: true},
    // numbers by age group
    customersByAge: {type: Map, of: Number},
},{timestamps: true});

module.exports = hourlyReportSchema;





