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
        return await prisma.game.create({ data });
    }
    async getGames() {
        return await prisma.game.findMany();
    }
    async updateGame(id, data) {
        return await prisma.game.update({ where: { id }, data });
    }
    async deleteGame(id) {
        return await prisma.game.delete({ where: { id } });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map