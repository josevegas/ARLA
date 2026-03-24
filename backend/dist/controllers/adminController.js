"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTable = exports.updateTable = exports.getTables = exports.createTable = exports.getDifficulties = exports.getCategories = exports.deleteGame = exports.updateGame = exports.getGames = exports.createGame = exports.deletePromotion = exports.updatePromotion = exports.getPromotions = exports.createPromotion = exports.deleteMenuItem = exports.updateMenuItem = exports.getMenuItems = exports.createMenuItem = void 0;
const adminService_1 = require("../services/adminService");
const adminService = new adminService_1.AdminService();
// Menu Items
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
const updateMenuItem = async (req, res) => {
    try {
        const item = await adminService.updateMenuItem(req.params.id, req.body);
        res.json(item);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateMenuItem = updateMenuItem;
const deleteMenuItem = async (req, res) => {
    try {
        await adminService.deleteMenuItem(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteMenuItem = deleteMenuItem;
// Promotions
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
const updatePromotion = async (req, res) => {
    try {
        const promotion = await adminService.updatePromotion(req.params.id, req.body);
        res.json(promotion);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updatePromotion = updatePromotion;
const deletePromotion = async (req, res) => {
    try {
        await adminService.deletePromotion(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deletePromotion = deletePromotion;
// Games
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
const updateGame = async (req, res) => {
    try {
        const game = await adminService.updateGame(req.params.id, req.body);
        res.json(game);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateGame = updateGame;
const deleteGame = async (req, res) => {
    try {
        await adminService.deleteGame(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteGame = deleteGame;
const getCategories = async (_req, res) => {
    try {
        const categories = await adminService.getCategories();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategories = getCategories;
const getDifficulties = async (_req, res) => {
    try {
        const difficulties = await adminService.getDifficulties();
        res.json(difficulties);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDifficulties = getDifficulties;
const createTable = async (req, res) => {
    try {
        const table = await adminService.createTable(req.body);
        res.status(201).json(table);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTable = createTable;
const getTables = async (_req, res) => {
    try {
        const tables = await adminService.getTables();
        res.json(tables);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTables = getTables;
const updateTable = async (req, res) => {
    try {
        const table = await adminService.updateTable(req.params.id, req.body);
        res.json(table);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateTable = updateTable;
const deleteTable = async (req, res) => {
    try {
        await adminService.deleteTable(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteTable = deleteTable;
//# sourceMappingURL=adminController.js.map