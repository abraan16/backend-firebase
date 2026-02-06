
import express from 'express';
import * as interactionController from '../controllers/interactions.js';

const router = express.Router();

router.get('/', interactionController.getAllInteractions);
router.post('/', interactionController.createInteraction);
router.get('/:id', interactionController.getInteractionById);
router.put('/:id', interactionController.updateInteraction);
router.delete('/:id', interactionController.deleteInteraction);

export default router;
