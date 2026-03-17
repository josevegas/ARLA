"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGames = exports.createGame = exports.getPromotions = exports.createPromotion = exports.getMenuItems = exports.createMenuItem = void 0;
const adminService_1 = require("../services/adminService");
const adminService = new adminService_1.AdminService();
const createMenuItem = async (req, res) => {
    try {
        const item = await adminService.createMenuItem(req.body);
        res.status(201).json(item);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createMenuItem = createMenuItem;
const getMenuItems = async (_req, res) => {
    try {
        const items = await adminService.getMenuItems();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMenuItems = getMenuItems;
const createPromotion = async (req, res) => {
    try {
        const promotion = await adminService.createPromotion(req.body);
        res.status(201).json(promotion);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createPromotion = createPromotion;
const getPromotions = async (_req, res) => {
    try {
        const promotions = await adminService.getPromotions();
        res.json(promotions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPromotions = getPromotions;
const createGame = async (req, res) => {
    try {
        const game = await adminService.createGame(req.body);
        res.status(201).json(game);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createGame = createGame;
const getGames = async (_req, res) => {
    try {
        const games = await adminService.getGames();
        res.json(games);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getGames = getGames;
//# sourceMappingURL=adminController.js.map