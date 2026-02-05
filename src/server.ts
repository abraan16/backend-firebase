
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

// --- WEBHOOK DE WHATSAPP ---

// Leer el token de verificación desde las variables de entorno
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

// VERIFICACIÓN DEL WEBHOOK (GET)
app.get('/api/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      console.error('Webhook verification failed. Token mismatch.');
      res.sendStatus(403);
    }
  } else {
      res.sendStatus(400);
  }
});

// RECEPCIÓN DE MENSAJES (POST)
app.post('/api/whatsapp/webhook', async (req, res) => {
    try {
        console.log("Webhook received:", JSON.stringify(req.body, null, 2));
        // Aquí tu lógica existente para procesar el mensaje
        const result = await inputService.handleIncomingMessage(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error processing webhook:', error);
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
