
const organizationService = require('./organizations.js');
const patientService = require('./patients.js');
const interactionService = require('./interactions.js');

/**
 * El corazón del sistema de enrutamiento y normalización.
 * Procesa cada mensaje entrante de WhatsApp.
 */
async function handleIncomingMessage(payload) {
    console.log("Processing incoming message payload:", payload);

    const { instance: instanceName, data } = payload;
    if (!instanceName || !data || !data.key) {
        console.error("Payload inválido: falta instanceName o data.");
        return { status: "error", message: "Payload inválido" };
    }

    const { remoteJid, fromMe } = data.key;
    const phoneNumber = remoteJid ? remoteJid.split('@')[0] : null;

    // Ignorar mensajes salientes (enviados por el bot)
    if (fromMe) {
        console.log("Ignorando mensaje saliente.");
        return { status: "ignored", reason: "fromMe is true" };
    }

    // --- 1. NORMALIZACIÓN DE IDENTIDAD ---

    // Buscar la organización por el nombre de la instancia
    const organization = await organizationService.getOrganizationByInstanceName(instanceName);
    if (!organization) {
        console.error(`Organización no encontrada para la instancia: ${instanceName}`);
        // En un futuro, se podría crear una organización "temporal" o notificar a un admin.
        return { status: "error", message: `Organización no configurada: ${instanceName}` };
    }

    // Buscar al paciente por número de teléfono dentro de esa organización
    let patient = await patientService.getPatientByPhone(phoneNumber, organization.id);

    // Si el paciente no existe, crearlo automáticamente
    if (!patient) {
        console.log(`Paciente no encontrado con teléfono ${phoneNumber}. Creando uno nuevo...`);
        patient = await patientService.createPatient({
            name: data.pushName || 'Nuevo Contacto', // Usar el nombre de WhatsApp o un placeholder
            phone: phoneNumber,
            organizationId: organization.id,
        });
        console.log(`Paciente creado con ID: ${patient.id}`);
    }

    // --- 2. REGISTRO DE LA INTERACCIÓN ---

    const messageContent = data.message?.conversation || data.message?.extendedTextMessage?.text || '';

    await interactionService.createInteraction({
        patientId: patient.id,
        organizationId: organization.id,
        message: messageContent,
        sender: 'patient', // Este mensaje siempre viene del paciente
        timestamp: data.messageTimestamp,
    });

    console.log(`Interacción registrada para el paciente ${patient.id} en la organización ${organization.id}`);

    // --- 3. ENRUTAMIENTO INTELIGENTE (Placeholder) ---
    // Aquí es donde en el futuro llamaremos al IntelligenceService

    console.log("TODO: Implementar enrutamiento al servicio de inteligencia (Marketing vs. Operativo).");

    return { status: "processed", patientId: patient.id, organizationId: organization.id };
}

module.exports = {
    handleIncomingMessage,
};
