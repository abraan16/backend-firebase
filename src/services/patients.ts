
import db from './firebase';

export interface Patient {
    id: string;
    name: string;
    phone: string;
    updated_at: string;
}

export interface PatientData {
    name: string;
    phone: string;
}

export async function getAllPatients(): Promise<Patient[]> {
    const patientsSnapshot = await db.collection('patients').get();
    const patients: Patient[] = [];
    patientsSnapshot.forEach((doc: any) => {
        patients.push({ id: doc.id, ...doc.data() });
    });
    return patients;
}

export async function createPatient(patientData: PatientData): Promise<Patient> {
    const { name, phone } = patientData;

    const dataToStore = {
        name,
        phone,
        updated_at: new Date().toISOString(),
    };

    const patientRef = await db.collection('patients').add(dataToStore);

    return { id: patientRef.id, ...dataToStore };
}

export async function getPatientById(id: string): Promise<Patient | null> {
    const patientDoc = await db.collection('patients').doc(id).get();
    if (!patientDoc.exists) {
        return null;
    }
    return { id: patientDoc.id, ...patientDoc.data() } as Patient;
}

export async function updatePatient(id: string, patientData: Partial<PatientData>): Promise<Patient> {
    const patientRef = db.collection('patients').doc(id);
    await patientRef.update({
        ...patientData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await patientRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Patient;
}

export async function deletePatient(id: string): Promise<void> {
    await db.collection('patients').doc(id).delete();
}
