
const db = require('./firebase.js');

async function getAllInteractions() {
    const interactionsSnapshot = await db.collection('interactions').get();
    const interactions = [];
    interactionsSnapshot.forEach(doc => {
        interactions.push({ id: doc.id, ...doc.data() });
    });
    return interactions;
}

async function createInteraction(interactionData) {
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

    const interactionRef = await db.collection('interactions').add({
        patientId,
        organizationId,
        message,
        sender,
        created_at: timestamp ? new Date(timestamp * 1000).toISOString() : new Date().toISOString(),
    });

    return { id: interactionRef.id, ...interactionData };
}

async function getInteractionById(id) {
    const interactionDoc = await db.collection('interactions').doc(id).get();
    if (!interactionDoc.exists) {
        return null;
    }
    return { id: interactionDoc.id, ...interactionDoc.data() };
}

async function updateInteraction(id, interactionData) {
    const interactionRef = db.collection('interactions').doc(id);
    await interactionRef.update({
        ...interactionData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await interactionRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

async function deleteInteraction(id) {
    await db.collection('interactions').doc(id).delete();
}

module.exports = {
    getAllInteractions,
    createInteraction,
    getInteractionById,
    updateInteraction,
    deleteInteraction,
};
