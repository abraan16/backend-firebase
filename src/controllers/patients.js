
const patientService = require('../services/patients.js');

async function getAllPatients(req, res) {
    try {
        const patients = await patientService.getAllPatients();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createPatient(req, res) {
    try {
        const patient = await patientService.createPatient(req.body);
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPatientById(req, res) {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updatePatient(req, res) {
    try {
        const patient = await patientService.updatePatient(req.params.id, req.body);
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deletePatient(req, res) {
    try {
        await patientService.deletePatient(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllPatients,
    createPatient,
    getPatientById,
    updatePatient,
    deletePatient,
};
