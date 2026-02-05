
import { Request, Response } from 'express';
import * as userService from '../services/users';

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
