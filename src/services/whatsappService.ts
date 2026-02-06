
import axios from 'axios';
import 'dotenv/config';

// Interfaz para definir la estructura de la respuesta de Evolution API
interface EvolutionApiResponse {
    status: string;
    // ... otras propiedades que puedan venir en la respuesta
}

// Interfaz para los parámetros de la función de envío de mensajes
interface SendMessageParams {
    instanceName: string;
    phoneNumber: string;
    text: string;
}

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
export async function sendMessage({ instanceName, phoneNumber, text }: SendMessageParams): Promise<EvolutionApiResponse> {
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
        const response = await axios.post<EvolutionApiResponse>(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': evolutionApiKey
            }
        });
        
        console.log('Message sent successfully. API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending message via Evolution API:');
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
            console.error('Headers:', error.response?.headers);
        } else {
            console.error('An unexpected error occurred:', error);
        }
        // Re-lanzamos el error para que el servicio que llama pueda manejarlo.
        throw error;
    }
}
