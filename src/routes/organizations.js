
import express from 'express';
import * as organizationController from '../controllers/organizations.js';

const router = express.Router();

router.get('/', organizationController.getAllOrganizations);
router.post('/', organizationController.createOrganization);
router.get('/:id', organizationController.getOrganizationById);
router.put('/:id', organizationController.updateOrganization);
router.delete('/:id', organizationController.deleteOrganization);

export default router;
