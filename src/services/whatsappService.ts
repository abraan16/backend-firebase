
import axios from 'axios';

// Interfaz para definir la estructura de la respuesta de Evolution API
interface EvolutionApiResponse {
    status: string;
    // ... otras propiedades que puedan venir en la respuesta
}

// Interfaz para los parámetros de la función de envío de mensajes
interface SendMessageParams {
    phoneNumber: string;
    text: string;
}

const evolutionApiUrl = process.env.EVOLUTION_API_URL;
const evolutionApiKey = process.env.EVOLUTION_API_KEY;
const evolutionInstance = process.env.EVOLUTION_INSTANCE; // Nueva variable de entorno

if (!evolutionApiUrl || !evolutionApiKey || !evolutionInstance) {
    throw new Error('EVOLUTION_API_URL, EVOLUTION_API_KEY, and EVOLUTION_INSTANCE must be set in the environment variables.');
}

/**
 * Envía un mensaje de texto a un número de teléfono a través de la Evolution API.
 * @param params - Los parámetros para enviar el mensaje.
 * @returns La respuesta de la API de Evolution.
 */
export async function sendMessage({ phoneNumber, text }: SendMessageParams): Promise<EvolutionApiResponse> {
    // Usamos la variable de entorno para el nombre de la instancia
    const endpoint = `${evolutionApiUrl}/message/sendText/${evolutionInstance}`;

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
        console.log(`Sending message to ${remoteJid} via instance ${evolutionInstance}...`);
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
            // Log más detallado para el debugging
            console.error('Request URL:', error.config?.url);
            console.error('Request Method:', error.config?.method);
            console.error('Request Headers:', error.config?.headers);
            console.error('Request Payload:', error.config?.data);
            console.error('Response Status:', error.response?.status);
            console.error('Response Data:', error.response?.data);
        } else {
            console.error('An unexpected error occurred:', error);
        }
        // Re-lanzamos el error para que el servicio que llama pueda manejarlo.
        throw error;
    }
}
