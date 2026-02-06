
import * as interactionService from '../services/interactions.js';

export async function getAllInteractions(req, res) {
    try {
        const interactions = await interactionService.getAllInteractions();
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function createInteraction(req, res) {
    try {
        const interaction = await interactionService.createInteraction(req.body);
        res.status(201).json(interaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getInteractionById(req, res) {
    try {
        const interaction = await interactionService.getInteractionById(req.params.id);
        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        res.json(interaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateInteraction(req, res) {
    try {
        const interaction = await interactionService.updateInteraction(req.params.id, req.body);
        res.json(interaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteInteraction(req, res) {
    try {
        await interactionService.deleteInteraction(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
