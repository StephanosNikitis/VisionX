const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

const signToken = (id, type) => 
    jwt.sign({id,type}, process.env.JWT_SECRET, {expiresIn: '7d'});

router.post('/doctor/register',
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({min:6}),
    ],
    validate,
    async (req, res) => {
        try {
            const exists = await Doctor.findOne({email: req.body.email});
            if(exists) return res.badRequest("Doctor already exists");
            const hashed = await bcrypt.hash(req.body.password, 12);
            const doc = await Doctor.create({...req.body, password:hashed});
            const token = signToken(doc._id, 'doctor');
            res.created({token, user: {id:doc._id, type:'doctor'}},'Doctor registered')
        } catch (error) {
            console.error('Doctor registration error:', error.message, error.stack);
            res.serverError('Registration failed', [error.message])
        }
    }
)

router.post('/doctor/login',
    [
        body('email').isEmail(),
        body('password').isLength({min:6}),
    ],
    validate,
    async (req, res) => {
        try {
            const doc = await Doctor.findOne({email: req.body.email});
            if(!doc ||  !doc.password) return res.unauthorized("Invalid credentials");
            const match = await bcrypt.compare(req.body.password, doc.password);
            if(!match ) return res.unauthorized("Invalid credentials");
            const token = signToken(doc._id, 'doctor');
            res.created({token, user: {id:doc._id, type:'doctor'}},'Login successful')
        } catch (error) {
            res.serverError('Login failed', [error.message])
        }
    }
)

router.post('/patient/register',
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({min:6}),
    ],
    validate,
    async (req, res) => {
        try {
            const exists = await Patient.findOne({email: req.body.email});
            if(exists) return res.badRequest("Patient already exists");
            const hashed = await bcrypt.hash(req.body.password, 12);
            const patient = await Patient.create({...req.body, password:hashed});
            const token = signToken(patient._id, 'patient');
            res.created({token, user: {id:patient._id, type:'patient'}},'Patient registered')
        } catch (error) {
            console.error('Patient registration error:', error.message, error.stack);
            res.serverError('Registration failed', [error.message])
        }
    }
)

router.post('/patient/login',
    [
        body('email').isEmail(),
        body('password').isLength({min:6}),
    ],
    validate,
    async (req, res) => {
        try {
            const patient = await Patient.findOne({email: req.body.email});
            if(!patient ||  !patient.password) return res.unauthorized("Invalid credentials");
            const match = await bcrypt.compare(req.body.password, patient.password);
            if(!match ) return res.unauthorized("Invalid credentials");
            const token = signToken(patient._id, 'patient');
            res.created({token, user: {id:patient._id, type:'patient'}},'Login successful')
        } catch (error) {
            res.serverError('Login failed', [error.message])
        }
    }
)

module.exports = router;