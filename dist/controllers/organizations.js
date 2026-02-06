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
exports.getAllOrganizations = getAllOrganizations;
exports.createOrganization = createOrganization;
exports.getOrganizationById = getOrganizationById;
exports.updateOrganization = updateOrganization;
exports.deleteOrganization = deleteOrganization;
const organizationService = __importStar(require("../services/organizations"));
async function getAllOrganizations(req, res) {
    try {
        const organizations = await organizationService.getAllOrganizations();
        res.json(organizations);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function createOrganization(req, res) {
    try {
        const organization = await organizationService.createOrganization(req.body);
        res.status(201).json(organization);
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function updateOrganization(req, res) {
    try {
        const organization = await organizationService.updateOrganization(req.params.id, req.body);
        res.json(organization);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function deleteOrganization(req, res) {
    try {
        await organizationService.deleteOrganization(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
