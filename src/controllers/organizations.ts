
import { Request, Response } from 'express';
import * as organizationService from '../services/organizations';

export async function getAllOrganizations(req: Request, res: Response) {
    try {
        const organizations = await organizationService.getAllOrganizations();
        res.json(organizations);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createOrganization(req: Request, res: Response) {
    try {
        const organization = await organizationService.createOrganization(req.body);
        res.status(201).json(organization);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getOrganizationById(req: Request, res: Response) {
    try {
        const organization = await organizationService.getOrganizationById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json(organization);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateOrganization(req: Request, res: Response) {
    try {
        const organization = await organizationService.updateOrganization(req.params.id, req.body);
        res.json(organization);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteOrganization(req: Request, res: Response) {
    try {
        await organizationService.deleteOrganization(req.params.id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
