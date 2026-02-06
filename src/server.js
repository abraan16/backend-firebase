import express from 'express';

import userRoutes from './routes/users.js';
import organizationRoutes from './routes/organizations.js';
import patientRoutes from './routes/patients.js';
import interactionRoutes from './routes/interactions.js';
import * as inputService from './services/inputService.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World! Diana IA is running.');
});

// --- WEBHOOK DE WHATSAPP PARA EVOLUTION API ---

app.get('/webhook/evolution', (req, res) => {
  console.log("GET request to /webhook/evolution received. Service is active.");
  res.status(200).send('Webhook endpoint for Evolution API is active.');
});

/**
 * Maneja los webhooks entrantes de Evolution API para los mensajes.
 * Este es el punto de entrada principal para la lógica de la IA.
 */
app.post('/webhook/evolution', async (req, res) => {
    console.log("Webhook received from Evolution API:", req.body);

    // El payload contiene el evento y los datos del mensaje
    const payload = req.body;

    // Validar que el payload tenga la estructura esperada
    if (!payload.event || payload.event !== 'messages.upsert') {
        console.log("Ignorando evento que no es un mensaje nuevo.");
        return res.status(200).send('Event ignored');
    }

    try {
        // Llamar al servicio de input para procesar el mensaje
        const result = await inputService.handleIncomingMessage(payload);
        console.log("Processing result:", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error processing webhook:", error);
        let message = 'An unknown error occurred while processing the webhook.';
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(500).json({ status: "error", message });
    }
});

// --- RUTAS DE LA API PARA LA GESTIÓN DEL SISTEMA ---
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/interactions', interactionRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
