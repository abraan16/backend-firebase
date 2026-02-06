"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrganizations = getAllOrganizations;
exports.createOrganization = createOrganization;
exports.getOrganizationById = getOrganizationById;
exports.getOrganizationByInstanceName = getOrganizationByInstanceName;
exports.updateOrganization = updateOrganization;
exports.deleteOrganization = deleteOrganization;
const firebase_1 = __importDefault(require("./firebase"));
async function getAllOrganizations() {
    const organizationsSnapshot = await firebase_1.default.collection('organizations').get();
    const organizations = [];
    organizationsSnapshot.forEach((doc) => {
        organizations.push({ id: doc.id, ...doc.data() });
    });
    return organizations;
}
async function createOrganization(organizationData) {
    const { name, instanceName } = organizationData; // Añadido instanceName
    if (!name || !instanceName) {
        throw new Error('El nombre de la organización y el instanceName son obligatorios.');
    }
    const dataToStore = {
        name,
        instanceName, // Guardamos el nuevo campo
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    const organizationRef = await firebase_1.default.collection('organizations').add(dataToStore);
    return { id: organizationRef.id, ...dataToStore };
}
async function getOrganizationById(id) {
    const organizationDoc = await firebase_1.default.collection('organizations').doc(id).get();
    if (!organizationDoc.exists) {
        return null;
    }
    return { id: organizationDoc.id, ...organizationDoc.data() };
}
// --- NUEVA FUNCIÓN ---
// Encuentra una organización por su nombre de instancia de WhatsApp
async function getOrganizationByInstanceName(instanceName) {
    const snapshot = await firebase_1.default.collection('organizations').where('instanceName', '==', instanceName).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
}
async function updateOrganization(id, organizationData) {
    const organizationRef = firebase_1.default.collection('organizations').doc(id);
    await organizationRef.update({
        ...organizationData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await organizationRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}
async function deleteOrganization(id) {
    await firebase_1.default.collection('organizations').doc(id).delete();
}
