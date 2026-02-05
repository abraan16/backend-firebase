
import db from './firebase';

export interface Interaction {
    id: string;
    patientId: string;
    organizationId: string;
    message: string;
    sender: 'patient' | 'bot';
    created_at: string;
    updated_at?: string;
}

export interface InteractionData {
    patientId: string;
    organizationId: string;
    message: string;
    sender: 'patient' | 'bot';
    timestamp?: number;
}


export async function getAllInteractions(): Promise<Interaction[]> {
    const interactionsSnapshot = await db.collection('interactions').get();
    const interactions: Interaction[] = [];
    interactionsSnapshot.forEach((doc: any) => {
        interactions.push({ id: doc.id, ...doc.data() });
    });
    return interactions;
}

export async function createInteraction(interactionData: InteractionData): Promise<Interaction> {
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

export async function getInteractionById(id: string): Promise<Interaction | null> {
    const interactionDoc = await db.collection('interactions').doc(id).get();
    if (!interactionDoc.exists) {
        return null;
    }
    return { id: interactionDoc.id, ...interactionDoc.data() } as Interaction;
}

export async function updateInteraction(id: string, interactionData: Partial<InteractionData>): Promise<Interaction> {
    const interactionRef = db.collection('interactions').doc(id);
    await interactionRef.update({
        ...interactionData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await interactionRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Interaction;
}

export async function deleteInteraction(id: string): Promise<void> {
    await db.collection('interactions').doc(id).delete();
}
