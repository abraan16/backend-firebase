"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const evolutionApiUrl = process.env.EVOLUTION_API_URL;
const evolutionApiKey = process.env.EVOLUTION_API_KEY;
if (!evolutionApiUrl || !evolutionApiKey) {
    throw new Error('EVOLUTION_API_URL and EVOLUTION_API_KEY must be set in the environment variables.');
}
/**
 * Envía un mensaje de texto a un número de teléfono a través de la Evolution API.
 * @param params - Los parámetros para enviar el mensaje.
 * @returns La respuesta de la API de Evolution.
 */
async function sendMessage({ instanceName, phoneNumber, text }) {
    const endpoint = `${evolutionApiUrl}/message/sendText/${instanceName}`;
    // El número de teléfono en Evolution API debe terminar en @s.whatsapp.net
    const remoteJid = `${phoneNumber}@s.whatsapp.net`;
    const payload = {
        number: remoteJid,
        options: {
            delay: 1200,
            presence: 'composing'
        },
        textMessage: {
            text: text
        }
    };
    try {
        console.log(`Sending message to ${remoteJid} via instance ${instanceName}...`);
        const response = await axios_1.default.post(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': evolutionApiKey
            }
        });
        console.log('Message sent successfully. API Response:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error sending message via Evolution API:');
        if (axios_1.default.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
            console.error('Headers:', error.response?.headers);
        }
        else {
            console.error('An unexpected error occurred:', error);
        }
        // Re-lanzamos el error para que el servicio que llama pueda manejarlo.
        throw error;
    }
}
