
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
    const { patientId, message } = interactionData;

    const interactionRef = await db.collection('interactions').add({
        patientId,
        message,
        created_at: new Date().toISOString(),
    });

    return { id: interactionRef.id, patientId, message };
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
