
const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactions.js');

router.get('/', interactionController.getAllInteractions);
router.post('/', interactionController.createInteraction);
router.get('/:id', interactionController.getInteractionById);
router.put('/:id', interactionController.updateInteraction);
router.delete('/:id', interactionController.deleteInteraction);

module.exports = router;
