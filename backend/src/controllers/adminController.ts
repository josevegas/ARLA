import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

const adminService = new AdminService();

// Menu Items
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const item = await adminService.createMenuItem(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMenuItems = async (_req: Request, res: Response) => {
  try {
    const items = await adminService.getMenuItems();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const item = await adminService.updateMenuItem(req.params.id, req.body);
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    await adminService.deleteMenuItem(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Promotions
export const createPromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await adminService.createPromotion(req.body);
    res.status(201).json(promotion);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPromotions = async (_req: Request, res: Response) => {
  try {
    const promotions = await adminService.getPromotions();
    res.json(promotions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await adminService.updatePromotion(req.params.id, req.body);
    res.json(promotion);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    await adminService.deletePromotion(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Games
export const createGame = async (req: Request, res: Response) => {
  try {
    const game = await adminService.createGame(req.body);
    res.status(201).json(game);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getGames = async (_req: Request, res: Response) => {
  try {
    const games = await adminService.getGames();
    res.json(games);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGame = async (req: Request, res: Response) => {
  try {
    const game = await adminService.updateGame(req.params.id, req.body);
    res.json(game);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    await adminService.deleteGame(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await adminService.getCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDifficulties = async (_req: Request, res: Response) => {
  try {
    const difficulties = await adminService.getDifficulties();
    res.json(difficulties);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

