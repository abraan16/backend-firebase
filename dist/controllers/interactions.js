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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInteractions = getAllInteractions;
exports.createInteraction = createInteraction;
exports.getInteractionById = getInteractionById;
exports.updateInteraction = updateInteraction;
exports.deleteInteraction = deleteInteraction;
const interactionService = __importStar(require("../services/interactions"));
async function getAllInteractions(req, res) {
    try {
        const interactions = await interactionService.getAllInteractions();
        res.json(interactions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function createInteraction(req, res) {
    try {
        const interaction = await interactionService.createInteraction(req.body);
        res.status(201).json(interaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function getInteractionById(req, res) {
    try {
        const interaction = await interactionService.getInteractionById(req.params.id);
        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        res.json(interaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function updateInteraction(req, res) {
    try {
        const interaction = await interactionService.updateInteraction(req.params.id, req.body);
        res.json(interaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function deleteInteraction(req, res) {
    try {
        await interactionService.deleteInteraction(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
