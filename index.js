
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Importación de rutas existentes
const userRoutes = require('./src/routes/users.js');
const organizationRoutes = require('./src/routes/organizations.js');
const patientRoutes = require('./src/routes/patients.js');
const interactionRoutes = require('./src/routes/interactions.js');

// Importación del nuevo servicio de entrada
const inputService = require('./src/services/inputService.js');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! Diana IA is running.');
});

// RUTAS DE API EXISTENTES
app.use('/users', userRoutes);
app.use('/organizations', organizationRoutes);
app.use('/patients', patientRoutes);
app.use('/interactions', interactionRoutes);

// NUEVA RUTA PARA EL WEBHOOK DE WHATSAPP
app.post('/api/whatsapp/webhook', async (req, res) => {
    try {
        console.log("Webhook received:", req.body);
        const result = await inputService.handleIncomingMessage(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Failed to process webhook' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
