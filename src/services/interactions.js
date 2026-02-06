
import db from './firebase.js';

export async function getAllInteractions() {
    const interactionsSnapshot = await db.collection('interactions').get();
    const interactions = [];
    interactionsSnapshot.forEach((doc) => {
        interactions.push({ id: doc.id, ...doc.data() });
    });
    return interactions;
}

export async function createInteraction(interactionData) {
    const {
        patientId,
        organizationId,
        message,
        sender, // 'patient' o 'bot'
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
    }

    const interactionRef = await db.collection('interactions').add(dataToStore);

    return { id: interactionRef.id, ...dataToStore };
}

export async function getInteractionById(id) {
    const interactionDoc = await db.collection('interactions').doc(id).get();
    if (!interactionDoc.exists) {
        return null;
    }
    return { id: interactionDoc.id, ...interactionDoc.data() };
}

export async function updateInteraction(id, interactionData) {
    const interactionRef = db.collection('interactions').doc(id);
    await interactionRef.update({
        ...interactionData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await interactionRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function deleteInteraction(id) {
    await db.collection('interactions').doc(id).delete();
}
