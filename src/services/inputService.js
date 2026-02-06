
const organizationService = require('./organizations.js');
const patientService = require('./patients.js');
const interactionService = require('./interactions.js');
// Importamos los nuevos servicios
const { getIntelligenceResponse } = require('./intelligenceService.js');
const { sendMessage } = require('./whatsappService.js');

/**
 * El corazón del sistema de enrutamiento y normalización.
 * Procesa cada mensaje entrante de WhatsApp, genera una respuesta y la envía.
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

    if (fromMe) {
        console.log("Ignorando mensaje saliente.");
        return { status: "ignored", reason: "fromMe is true" };
    }

    if (!phoneNumber) {
        console.error("No se pudo extraer el número de teléfono del payload.");
        return { status: "error", message: "Número de teléfono inválido" };
    }

    // --- 1. NORMALIZACIÓN DE IDENTIDAD ---
    const organization = await organizationService.getOrganizationByInstanceName(instanceName);
    if (!organization) {
        console.error(`Organización no encontrada para la instancia: ${instanceName}`);
        return { status: "error", message: `Organización no configurada: ${instanceName}` };
    }

    let patient = await patientService.getPatientByPhone(phoneNumber, organization.id);
    if (!patient) {
        console.log(`Paciente no encontrado con teléfono ${phoneNumber}. Creando uno nuevo...`);
        patient = await patientService.createPatient({
            name: data.pushName || 'Nuevo Contacto',
            phone: phoneNumber,
            organizationId: organization.id,
        });
        console.log(`Paciente creado con ID: ${patient.id}`);
    }

    // --- 2. REGISTRO DE LA INTERACCIÓN ENTRANTE ---
    const messageContent = data.message?.conversation || data.message?.extendedTextMessage?.text || '';

    if (!messageContent) {
        console.log("Mensaje vacío o no soportado (ej. imagen, audio). Ignorando.");
        return { status: "ignored", reason: "Empty or unsupported message type" };
    }

    await interactionService.createInteraction({
        patientId: patient.id,
        organizationId: organization.id,
        message: messageContent,
        sender: 'patient',
        timestamp: data.messageTimestamp,
    });
    console.log(`Interacción ENTRANTE registrada para el paciente ${patient.id}`);

    // --- 3. GENERAR Y ENVIAR RESPUESTA DE IA ---
    try {
        // Obtener la respuesta del "cerebro" de IA
        const replyText = await getIntelligenceResponse({
            userMessage: messageContent,
            userName: patient.name,
        });

        // Enviar la respuesta usando el servicio de WhatsApp
        await sendMessage({
            instanceName: instanceName,
            phoneNumber: phoneNumber,
            text: replyText,
        });

        // Registrar la interacción SALIENTE
        await interactionService.createInteraction({
            patientId: patient.id,
            organizationId: organization.id,
            message: replyText,
            sender: 'bot', // Este mensaje lo envía nuestro bot
            timestamp: Math.floor(Date.now() / 1000), // Usamos el timestamp actual
        });
        console.log(`Interacción SALIENTE registrada para el paciente ${patient.id}`);

    } catch (error) {
        console.error("Error en el flujo de respuesta de la IA:", error);
        // Si falla el envío, al menos el mensaje entrante quedó registrado.
        return { status: "error", message: "Failed to generate or send AI response" };
    }

    return { status: "processed_and_replied", patientId: patient.id };
}

module.exports = {
    handleIncomingMessage,
};
