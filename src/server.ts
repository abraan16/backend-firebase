
import express from 'express';
import 'dotenv/config';

import userRoutes from './routes/users';
import organizationRoutes from './routes/organizations';
import patientRoutes from './routes/patients';
import interactionRoutes from './routes/interactions';
import * as inputService from './services/inputService';

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

// RECEPCIÓN DE MENSAJES (POST)
app.post('/webhook/evolution', async (req, res) => {
    try {
        console.log("Webhook received from Evolution API:", JSON.stringify(req.body, null, 2));
        const result = await inputService.handleIncomingMessage(req.body);
        res.status(200).json({ status: "ok", message: "Message processed", result });
    } catch (error) {
        console.error('Error processing webhook from Evolution API:', error);
        res.status(500).json({ error: 'Failed to process webhook' });
    }
});


// --- RUTAS DE API EXISTENTES ---
app.use('/users', userRoutes);
app.use('/organizations', organizationRoutes);
app.use('/patients', patientRoutes);
app.use('/interactions', interactionRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
