const mongoose = require('mongoose');

const bedBookingSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    bedType: {
        type: String,
        enum: ['totalBeds', 'icuBeds', 'emergencyBeds'],
        required: true
    },
    status: {
        type: String,
        enum: ['requested', 'confirmed', 'discharged'],
        default: 'requested'
    }
}, { timestamps: true });

module.exports = mongoose.model('BedBooking', bedBookingSchema);