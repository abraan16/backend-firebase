"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInteractions = getAllInteractions;
exports.createInteraction = createInteraction;
exports.getInteractionById = getInteractionById;
exports.updateInteraction = updateInteraction;
exports.deleteInteraction = deleteInteraction;
const firebase_1 = __importDefault(require("./firebase"));
async function getAllInteractions() {
    const interactionsSnapshot = await firebase_1.default.collection('interactions').get();
    const interactions = [];
    interactionsSnapshot.forEach((doc) => {
        interactions.push({ id: doc.id, ...doc.data() });
    });
    return interactions;
}
async function createInteraction(interactionData) {
    const { patientId, organizationId, message, sender, // 'patient' o 'bot'
    timestamp, // El timestamp del mensaje original
     } = interactionData;
    if (!patientId || !organizationId || !message || !sender) {
        throw new Error('Faltan datos obligatorios para crear la interacción.');
    }
    const dataToStore = {
        patientId,
        organizationId,
        message,
        sender,
        created_at: timestamp ? new Date(timestamp * 1000).toISOString() : new Date().toISOString(),
    };
    const interactionRef = await firebase_1.default.collection('interactions').add(dataToStore);
    return { id: interactionRef.id, ...dataToStore };
}
async function getInteractionById(id) {
    const interactionDoc = await firebase_1.default.collection('interactions').doc(id).get();
    if (!interactionDoc.exists) {
        return null;
    }
    return { id: interactionDoc.id, ...interactionDoc.data() };
}
async function updateInteraction(id, interactionData) {
    const interactionRef = firebase_1.default.collection('interactions').doc(id);
    await interactionRef.update({
        ...interactionData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await interactionRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}
async function deleteInteraction(id) {
    await firebase_1.default.collection('interactions').doc(id).delete();
}
