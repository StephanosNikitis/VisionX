const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
    hospitalName: {
        type:String, 
        required:true
    },
    phone : {
        type:String,
        required:true,
    },
    city: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    totalBeds: {
        type:Number,
        default: 0
    },
    icuBeds: {
        type:Number,
        default: 0
    },
    emergencyBeds: {
        type:Number,
        default: 0
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    
},{timestamps:true})

module.exports = mongoose.model('Hospital', hospitalSchema);