
const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizations.js');

router.get('/', organizationController.getAllOrganizations);
router.post('/', organizationController.createOrganization);
router.get('/:id', organizationController.getOrganizationById);
router.put('/:id', organizationController.updateOrganization);
router.delete('/:id', organizationController.deleteOrganization);

module.exports = router;
