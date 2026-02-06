"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const users_1 = __importDefault(require("./routes/users"));
const organizations_1 = __importDefault(require("./routes/organizations"));
const patients_1 = __importDefault(require("./routes/patients"));
const interactions_1 = __importDefault(require("./routes/interactions"));
const inputService = __importStar(require("./services/inputService"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware para parsear el cuerpo de las peticiones
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello World! Diana IA is running.');
});
// --- WEBHOOK DE WHATSAPP PARA EVOLUTION API ---
// Evolution API no requiere una verificación GET compleja como la de Meta.
// Podemos usar este endpoint para confirmar que el servidor está activo.
app.get('/api/whatsapp/webhook', (req, res) => {
    console.log("GET request to /api/whatsapp/webhook received. Service is active.");
    res.status(200).send('Webhook endpoint for Evolution API is active.');
});
// RECEPCIÓN DE MENSAJES (POST)
// Aquí es donde Evolution API enviará los datos de los mensajes entrantes.
app.post('/api/whatsapp/webhook', async (req, res) => {
    try {
        console.log("Webhook received from Evolution API:", JSON.stringify(req.body, null, 2));
        // La lógica en inputService ya está preparada para este formato de payload.
        const result = await inputService.handleIncomingMessage(req.body);
        res.status(200).json({ status: "ok", message: "Message processed", result });
    }
    catch (error) {
        console.error('Error processing webhook from Evolution API:', error);
        res.status(500).json({ error: 'Failed to process webhook' });
    }
});
// --- RUTAS DE API EXISTENTES ---
app.use('/users', users_1.default);
app.use('/organizations', organizations_1.default);
app.use('/patients', patients_1.default);
app.use('/interactions', interactions_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
