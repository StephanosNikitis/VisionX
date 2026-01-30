const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const { authenticate, requireRole } = require('../middlewares/auth');
const BedBooking = require('../models/BedBooking');
const Hospital = require('../models/Hospital');

const router = express.Router();

router.post('/book',
    authenticate,
    requireRole('patient'),
    [
        body('hospitalId').notEmpty(),
        body('bedType').isIn(['totalBeds', 'icuBeds', 'emergencyBeds']),
    ],
    validate,
    async (req, res) => {
        try {
            const { hospitalId, bedType } = req.body;
            const patientId = req.user._id;

            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) {
                return res.notFound('Hospital not found');
            }

            const totalBeds = hospital[bedType] || 0;

            const activeBookings = await BedBooking.countDocuments({
                hospital: hospitalId,
                bedType: bedType,
                status: { $in: ['requested', 'confirmed'] }
            });

            if (activeBookings >= totalBeds) {
                return res.badRequest('No beds of the specified type are available');
            }

            const existingBooking = await BedBooking.findOne({
                patient: patientId,
                status: { $in: ['requested', 'confirmed'] }
            });

            if (existingBooking) {
                return res.badRequest('You already have an active bed booking.');
            }

            const booking = await BedBooking.create({
                patient: patientId,
                hospital: hospitalId,
                bedType: bedType
            });

            res.created(booking, 'Bed booking request submitted successfully');

        } catch (error) {
            res.serverError('Failed to book bed', [error.message]);
        }
    }
);

module.exports = router;