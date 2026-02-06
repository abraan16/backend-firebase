
import db from './firebase.js';

export async function getPatientByPhone(phone) {
    const patientsQuery = db.collection('patients').where('phone', '==', phone).limit(1);
    const snapshot = await patientsQuery.get();

    if (snapshot.empty) {
        return null;
    }

    const patientDoc = snapshot.docs[0];
    return { id: patientDoc.id, ...patientDoc.data() };
}

export async function getAllPatients() {
    const patientsSnapshot = await db.collection('patients').get();
    const patients = [];
    patientsSnapshot.forEach((doc) => {
        patients.push({ id: doc.id, ...doc.data() });
    });
    return patients;
}

export async function createPatient(patientData) {
    const { name, phone } = patientData;

    const dataToStore = {
        name,
        phone,
        updated_at: new Date().toISOString(),
    };

    const patientRef = await db.collection('patients').add(dataToStore);

    return { id: patientRef.id, ...dataToStore };
}

export async function getPatientById(id) {
    const patientDoc = await db.collection('patients').doc(id).get();
    if (!patientDoc.exists) {
        return null;
    }
    return { id: patientDoc.id, ...patientDoc.data() };
}

export async function updatePatient(id, patientData) {
    const patientRef = db.collection('patients').doc(id);
    await patientRef.update({
        ...patientData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await patientRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function deletePatient(id) {
    await db.collection('patients').doc(id).delete();
}
