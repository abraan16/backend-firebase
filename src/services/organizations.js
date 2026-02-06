
import db from './firebase.js';

export async function getAllOrganizations() {
    const organizationsSnapshot = await db.collection('organizations').get();
    const organizations = [];
    organizationsSnapshot.forEach((doc) => {
        organizations.push({ id: doc.id, ...doc.data() });
    });
    return organizations;
}

export async function createOrganization(organizationData) {
    const { name, instanceName, type = 'client' } = organizationData; // Se establece 'client' por defecto

    if (!name || !instanceName) {
        throw new Error('El nombre de la organización y el instanceName son obligatorios.');
    }

    const dataToStore = {
        name,
        instanceName,
        type, // Se guarda el tipo
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const organizationRef = await db.collection('organizations').add(dataToStore);

    // Aseguramos que el tipo devuelto sea 'manager' o 'client'
    const finalData = { id: organizationRef.id, ...dataToStore };
    
    // El tipo de `finalData` es inferido correctamente por TypeScript, pero para ser explícitos:
    return finalData;
}


export async function getOrganizationById(id) {
    const organizationDoc = await db.collection('organizations').doc(id).get();
    if (!organizationDoc.exists) {
        return null;
    }
    return { id: organizationDoc.id, ...organizationDoc.data() };
}

// --- NUEVA FUNCIÓN -- -
// Encuentra una organización por su nombre de instancia de WhatsApp
export async function getOrganizationByInstanceName(instanceName) {
    const snapshot = await db.collection('organizations').where('instanceName', '==', instanceName).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
}

export async function updateOrganization(id, organizationData) {
    const organizationRef = db.collection('organizations').doc(id);
    await organizationRef.update({
        ...organizationData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await organizationRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function deleteOrganization(id) {
    await db.collection('organizations').doc(id).delete();
}
