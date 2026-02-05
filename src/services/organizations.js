
const db = require('./firebase.js');

async function getAllOrganizations() {
    const organizationsSnapshot = await db.collection('organizations').get();
    const organizations = [];
    organizationsSnapshot.forEach(doc => {
        organizations.push({ id: doc.id, ...doc.data() });
    });
    return organizations;
}

async function createOrganization(organizationData) {
    const { name, instanceName } = organizationData; // Añadido instanceName

    if (!name || !instanceName) {
        throw new Error('El nombre de la organización y el instanceName son obligatorios.');
    }

    const organizationRef = await db.collection('organizations').add({
        name,
        instanceName, // Guardamos el nuevo campo
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    return { id: organizationRef.id, name, instanceName };
}

async function getOrganizationById(id) {
    const organizationDoc = await db.collection('organizations').doc(id).get();
    if (!organizationDoc.exists) {
        return null;
    }
    return { id: organizationDoc.id, ...organizationDoc.data() };
}

// --- NUEVA FUNCIÓN ---
// Encuentra una organización por su nombre de instancia de WhatsApp
async function getOrganizationByInstanceName(instanceName) {
    const snapshot = await db.collection('organizations').where('instanceName', '==', instanceName).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
}

async function updateOrganization(id, organizationData) {
    const organizationRef = db.collection('organizations').doc(id);
    await organizationRef.update({
        ...organizationData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await organizationRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

async function deleteOrganization(id) {
    await db.collection('organizations').doc(id).delete();
}

module.exports = {
    getAllOrganizations,
    createOrganization,
    getOrganizationById,
    getOrganizationByInstanceName, // Exportamos la nueva función
    updateOrganization,
    deleteOrganization,
};
