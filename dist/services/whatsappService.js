"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const axios_1 = __importDefault(require("axios"));
// Asegúrate de que dotenv/config se cargue al inicio
require("dotenv/config");

const evolutionApiUrl = process.env.EVOLUTION_API_URL;
const evolutionApiKey = process.env.EVOLUTION_API_KEY;
const evolutionInstance = process.env.EVOLUTION_INSTANCE;

if (!evolutionApiUrl || !evolutionApiKey || !evolutionInstance) {
    throw new Error('EVOLUTION_API_URL, EVOLUTION_API_KEY, and EVOLUTION_INSTANCE must be set in the environment variables.');
}

async function sendMessage({ phoneNumber, text }) {
    const encodedInstanceName = encodeURIComponent(evolutionInstance);
    const endpoint = `${evolutionApiUrl}/message/sendText/${encodedInstanceName}`;
    const remoteJid = `${phoneNumber}@s.whatsapp.net`;

    const payload = {
        number: remoteJid,
        options: {
            delay: 1200,
            presence: 'composing'
        },
        text: text // Propiedad 'text' en el nivel superior
    };

    try {
        console.log(`Sending message to ${remoteJid} via instance ${evolutionInstance}...`);
        const response = await axios_1.default.post(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': evolutionApiKey
            }
        });
        console.log('Message sent successfully. API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending message via Evolution API:');
        if (axios_1.default.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Data:', JSON.stringify(error.response?.data, null, 2));
        } else {
            console.error('An unexpected error occurred:', error);
        }
        throw error;
    }
}
