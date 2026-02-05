
import { Request, Response } from 'express';
import * as patientService from '../services/patients';

export async function getAllPatients(req: Request, res: Response) {
    try {
        const patients = await patientService.getAllPatients();
        res.json(patients);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createPatient(req: Request, res: Response) {
    try {
        const patient = await patientService.createPatient(req.body);
        res.status(201).json(patient);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getPatientById(req: Request, res: Response) {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updatePatient(req: Request, res: Response) {
    try {
        const patient = await patientService.updatePatient(req.params.id, req.body);
        res.json(patient);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deletePatient(req: Request, res: Response) {
    try {
        await patientService.deletePatient(req.params.id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
