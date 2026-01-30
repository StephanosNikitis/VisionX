const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const Hospital = require('../models/Hospital');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticate, requireRole} = require('../middlewares/auth');
const Doctor = require('../models/Doctor');
const BedBooking = require('../models/BedBooking');

const router = express.Router();

const signToken = (id, type) => 
    jwt.sign({id,type}, process.env.JWT_SECRET, {expiresIn: '7d'});

router.post('/signup',
    [
        body('hospitalName').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({min:6}),
        body('phone').notEmpty(),
        body('city').notEmpty(),
        body('address').notEmpty()
    ],
    validate,
    async (req, res) => {
        try {
            const exists = await Hospital.findOne({email: req.body.email});
            if(exists) return res.badRequest("Hospital already exists");
            const hashed = await bcrypt.hash(req.body.password, 12);
            const hospital = await Hospital.create({...req.body, password:hashed});
            const token = signToken(hospital._id, 'hospital');
            res.created({token, user: {id:hospital._id, type:'hospital'}},'Hospital registered')
        } catch (error) {
            console.error('Hospital registration error:', error.message, error.stack);
            res.serverError('Registration failed', [error.message])
        }
    }
)

router.post('/login',
    [
        body('email').isEmail(),
        body('password').isLength({min:6}),
    ],
    validate,
    async (req, res) => {
        try {
            const hospital = await Hospital.findOne({email: req.body.email});
            if(!hospital) return res.unauthorized("Invalid credentials");
            const match = await bcrypt.compare(req.body.password, hospital.password);
            if(!match ) return res.unauthorized("Invalid credentials");
            const token = signToken(hospital._.id, 'hospital');
            res.created({token, user: {id:hospital._id, type:'hospital'}},'Login successful')
        } catch (error) {
            res.serverError('Login failed', [error.message])
        }
    }
)

router.put('/doctors/:doctorId/remove',
    authenticate,
    requireRole('hospital'),
    async (req, res) => {
        try {
            const { doctorId } = req.params;
            const hospitalId = req.user._id;

            const doctor = await Doctor.findById(doctorId);

            if (!doctor) {
                return res.notFound('Doctor not found');
            }

            if (!doctor.hospital || doctor.hospital.toString() !== hospitalId.toString()) {
                return res.forbidden('This doctor is not associated with your hospital');
            }

            doctor.hospital = null;
            await doctor.save();

            res.ok(null, 'Doctor removed from hospital successfully');
        } catch (error) {
            res.serverError('Failed to remove doctor', [error.message]);
        }
    }
)


router.get('/bookings',
    authenticate,
    requireRole('hospital'),
    async (req, res) => {
        try {
            const hospitalId = req.user._id;

            const bookings = await BedBooking.find({ hospital: hospitalId })
                .populate('patient', 'name email') 
                .sort({ createdAt: -1 });

            res.ok(bookings, 'Bed booking details retrieved successfully');
        } catch (error) {
            res.serverError('Failed to retrieve bed booking details', [error.message]);
        }
    }
);

module.exports = router;