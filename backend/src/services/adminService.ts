import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminService {
  // Menu Items
  async createMenuItem(data: any) {
    return await prisma.menuItem.create({ data });
  }
  async getMenuItems() {
    return await prisma.menuItem.findMany();
  }
  async updateMenuItem(id: string, data: any) {
    return await prisma.menuItem.update({ where: { id }, data });
  }
  async deleteMenuItem(id: string) {
    return await prisma.menuItem.delete({ where: { id } });
  }

  // Promotions
  async createPromotion(data: any) {
    return await prisma.promotion.create({ data });
  }
  async getPromotions() {
    return await prisma.promotion.findMany();
  }
  async updatePromotion(id: string, data: any) {
    return await prisma.promotion.update({ where: { id }, data });
  }
  async deletePromotion(id: string) {
    return await prisma.promotion.delete({ where: { id } });
  }

  // Games
  async createGame(data: any) {
    return await prisma.game.create({ data });
  }
  async getGames() {
    return await prisma.game.findMany();
  }
  async updateGame(id: string, data: any) {
    return await prisma.game.update({ where: { id }, data });
  }
  async deleteGame(id: string) {
    return await prisma.game.delete({ where: { id } });
  }
}
