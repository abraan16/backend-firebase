"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPatients = getAllPatients;
exports.createPatient = createPatient;
exports.getPatientById = getPatientById;
exports.updatePatient = updatePatient;
exports.deletePatient = deletePatient;
const firebase_1 = __importDefault(require("./firebase"));
async function getAllPatients() {
    const patientsSnapshot = await firebase_1.default.collection('patients').get();
    const patients = [];
    patientsSnapshot.forEach((doc) => {
        patients.push({ id: doc.id, ...doc.data() });
    });
    return patients;
}
async function createPatient(patientData) {
    const { name, phone } = patientData;
    const dataToStore = {
        name,
        phone,
        updated_at: new Date().toISOString(),
    };
    const patientRef = await firebase_1.default.collection('patients').add(dataToStore);
    return { id: patientRef.id, ...dataToStore };
}
async function getPatientById(id) {
    const patientDoc = await firebase_1.default.collection('patients').doc(id).get();
    if (!patientDoc.exists) {
        return null;
    }
    return { id: patientDoc.id, ...patientDoc.data() };
}
async function updatePatient(id, patientData) {
    const patientRef = firebase_1.default.collection('patients').doc(id);
    await patientRef.update({
        ...patientData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await patientRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}
async function deletePatient(id) {
    await firebase_1.default.collection('patients').doc(id).delete();
}
