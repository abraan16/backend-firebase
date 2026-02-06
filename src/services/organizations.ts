
import db from './firebase';

export interface Organization {
    id: string;
    name: string;
    instanceName: string;
    type: 'manager' | 'client'; // Nuevo campo para distinguir el tipo de organización
    created_at: string;
    updated_at: string;
}

export interface OrganizationData {
    name: string;
    instanceName: string;
    type?: 'manager' | 'client'; // El tipo es opcional al crear
}

export async function getAllOrganizations(): Promise<Organization[]> {
    const organizationsSnapshot = await db.collection('organizations').get();
    const organizations: Organization[] = [];
    organizationsSnapshot.forEach((doc: any) => {
        organizations.push({ id: doc.id, ...doc.data() });
    });
    return organizations;
}

export async function createOrganization(organizationData: OrganizationData): Promise<Organization> {
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
    return finalData as Organization;
}


export async function getOrganizationById(id: string): Promise<Organization | null> {
    const organizationDoc = await db.collection('organizations').doc(id).get();
    if (!organizationDoc.exists) {
        return null;
    }
    return { id: organizationDoc.id, ...organizationDoc.data() } as Organization;
}

// --- NUEVA FUNCIÓN -- -
// Encuentra una organización por su nombre de instancia de WhatsApp
export async function getOrganizationByInstanceName(instanceName: string): Promise<Organization | null> {
    const snapshot = await db.collection('organizations').where('instanceName', '==', instanceName).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Organization;
}

export async function updateOrganization(id: string, organizationData: Partial<OrganizationData>): Promise<Organization> {
    const organizationRef = db.collection('organizations').doc(id);
    await organizationRef.update({
        ...organizationData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await organizationRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Organization;
}

export async function deleteOrganization(id: string): Promise<void> {
    await db.collection('organizations').doc(id).delete();
}
