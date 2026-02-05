
const db = require('./firebase.js');

async function getAllPatients() {
    const patientsSnapshot = await db.collection('patients').get();
    const patients = [];
    patientsSnapshot.forEach(doc => {
        patients.push({ id: doc.id, ...doc.data() });
    });
    return patients;
}

async function createPatient(patientData) {
    const { name, phone } = patientData;

    const patientRef = await db.collection('patients').add({
        name,
        phone,
        updated_at: new Date().toISOString(),
    });

    return { id: patientRef.id, name, phone };
}

async function getPatientById(id) {
    const patientDoc = await db.collection('patients').doc(id).get();
    if (!patientDoc.exists) {
        return null;
    }
    return { id: patientDoc.id, ...patientDoc.data() };
}

async function updatePatient(id, patientData) {
    const patientRef = db.collection('patients').doc(id);
    await patientRef.update({
        ...patientData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await patientRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

async function deletePatient(id) {
    await db.collection('patients').doc(id).delete();
}

module.exports = {
    getAllPatients,
    createPatient,
    getPatientById,
    updatePatient,
    deletePatient,
};
