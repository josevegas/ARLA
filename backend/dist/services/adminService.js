"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AdminService {
    // Menu Items
    async createMenuItem(data) {
        return await prisma.menuItem.create({ data });
    }
    async getMenuItems() {
        return await prisma.menuItem.findMany();
    }
    async updateMenuItem(id, data) {
        return await prisma.menuItem.update({ where: { id }, data });
    }
    async deleteMenuItem(id) {
        return await prisma.menuItem.delete({ where: { id } });
    }
    // Promotions
    async createPromotion(data) {
        return await prisma.promotion.create({ data });
    }
    async getPromotions() {
        return await prisma.promotion.findMany();
    }
    async updatePromotion(id, data) {
        return await prisma.promotion.update({ where: { id }, data });
    }
    async deletePromotion(id) {
        return await prisma.promotion.delete({ where: { id } });
    }
    // Games
    async createGame(data) {
        const { categoryIds, ...gameData } = data;
        return await prisma.game.create({
            data: {
                ...gameData,
                categories: categoryIds && categoryIds.length > 0 ? {
                    connect: categoryIds.map((id) => ({ id }))
                } : undefined
            },
            include: { categories: true, difficulty: true }
        });
    }
    async getGames() {
        return await prisma.game.findMany({
            include: { categories: true, difficulty: true }
        });
    }
    async updateGame(id, data) {
        const { categoryIds, ...gameData } = data;
        return await prisma.game.update({
            where: { id },
            data: {
                ...gameData,
                categories: categoryIds ? {
                    set: categoryIds.map((id) => ({ id }))
                } : { set: [] }
            },
            include: { categories: true, difficulty: true }
        });
    }
    async deleteGame(id) {
        return await prisma.game.delete({ where: { id } });
    }
    async getCategories() {
        return await prisma.category.findMany({ orderBy: { name: 'asc' } });
    }
    async getDifficulties() {
        return await prisma.difficulty.findMany({ orderBy: { createdAt: 'asc' } });
    }
    // Tables
    async createTable(data) {
        return await prisma.table.create({ data });
    }
    async getTables() {
        return await prisma.table.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async updateTable(id, data) {
        return await prisma.table.update({ where: { id }, data });
    }
    async deleteTable(id) {
        return await prisma.table.delete({ where: { id } });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map