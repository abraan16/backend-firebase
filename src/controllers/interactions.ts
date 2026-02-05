
import { Request, Response } from 'express';
import * as interactionService from '../services/interactions';

export async function getAllInteractions(req: Request, res: Response) {
    try {
        const interactions = await interactionService.getAllInteractions();
        res.json(interactions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createInteraction(req: Request, res: Response) {
    try {
        const interaction = await interactionService.createInteraction(req.body);
        res.status(201).json(interaction);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getInteractionById(req: Request, res: Response) {
    try {
        const interaction = await interactionService.getInteractionById(req.params.id);
        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }
        res.json(interaction);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateInteraction(req: Request, res: Response) {
    try {
        const interaction = await interactionService.updateInteraction(req.params.id, req.body);
        res.json(interaction);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteInteraction(req: Request, res: Response) {
    try {
        await interactionService.deleteInteraction(req.params.id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
