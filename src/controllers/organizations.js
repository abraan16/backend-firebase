
const organizationService = require('../services/organizations.js');

async function getAllOrganizations(req, res) {
    try {
        const organizations = await organizationService.getAllOrganizations();
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createOrganization(req, res) {
    try {
        const organization = await organizationService.createOrganization(req.body);
        res.status(201).json(organization);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getOrganizationById(req, res) {
    try {
        const organization = await organizationService.getOrganizationById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json(organization);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateOrganization(req, res) {
    try {
        const organization = await organizationService.updateOrganization(req.params.id, req.body);
        res.json(organization);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteOrganization(req, res) {
    try {
        await organizationService.deleteOrganization(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllOrganizations,
    createOrganization,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
};
