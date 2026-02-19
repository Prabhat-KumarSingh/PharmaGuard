const express = require('express');
const Patient = require('../models/Patient');

const router = express.Router();

/**
 * POST /api/patients
 * Create a new patient record
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, age, gender, ethnicity } = req.body;

    const patient = new Patient({
      patient_id: `PATIENT_${Date.now()}`,
      name,
      age,
      gender,
      ethnicity
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/patients/:patientId
 * Get patient by ID
 */
router.get('/:patientId', async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ patient_id: req.params.patientId })
      .populate('analysis_results');

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/patients
 * Get all patients
 */
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const patients = await Patient.find()
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await Patient.countDocuments();

    res.status(200).json({
      success: true,
      data: patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
