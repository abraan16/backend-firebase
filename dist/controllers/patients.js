"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPatients = getAllPatients;
exports.createPatient = createPatient;
exports.getPatientById = getPatientById;
exports.updatePatient = updatePatient;
exports.deletePatient = deletePatient;
const patientService = __importStar(require("../services/patients"));
async function getAllPatients(req, res) {
    try {
        const patients = await patientService.getAllPatients();
        res.json(patients);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function createPatient(req, res) {
    try {
        const patient = await patientService.createPatient(req.body);
        res.status(201).json(patient);
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function updatePatient(req, res) {
    try {
        const patient = await patientService.updatePatient(req.params.id, req.body);
        res.json(patient);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function deletePatient(req, res) {
    try {
        await patientService.deletePatient(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
