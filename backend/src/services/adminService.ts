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
    const { categoryIds, categories, difficulty, ...gameData } = data;
    return await prisma.game.create({
      data: {
        ...gameData,
        categories: categoryIds && categoryIds.length > 0 ? {
          connect: categoryIds.map((id: string) => ({ id }))
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

  async updateGame(id: string, data: any) {
    const { id: _, categoryIds, categories, difficulty, createdAt, updatedAt, ...gameData } = data;
    return await prisma.game.update({
      where: { id },
      data: {
        ...gameData,
        categories: categoryIds ? {
          set: categoryIds.map((id: string) => ({ id }))
        } : { set: [] }
      },
      include: { categories: true, difficulty: true }
    });
  }

  async deleteGame(id: string) {
    return await prisma.game.delete({ where: { id } });
  }

  async getCategories() {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async getDifficulties() {
    return await prisma.difficulty.findMany({ orderBy: { createdAt: 'asc' } });
  }

  // Tables
  async createTable(data: any) {
    return await prisma.table.create({ data });
  }
  async getTables() {
    return await prisma.table.findMany({ orderBy: { createdAt: 'desc' } });
  }
  async updateTable(id: string, data: any) {
    return await prisma.table.update({ where: { id }, data });
  }
  async deleteTable(id: string) {
    return await prisma.table.delete({ where: { id } });
  }

  // Admin Reservation Management
  async getAdminReservations() {
    return await prisma.table.findMany({
      include: {
        reservations: {
          include: { 
            games: true,
            user: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async updateReservationStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
    const oldRes = await prisma.reservation.findUnique({ where: { id } });
    const updated = await prisma.reservation.update({
      where: { id },
      data: { status }
    });

    if (status === 'CONFIRMED' && oldRes?.status !== 'CONFIRMED' && updated.userId) {
       await prisma.visit.create({
         data: {
           userId: updated.userId,
           date: updated.date,
         }
       });
       await prisma.user.update({
         where: { id: updated.userId },
         data: { points: { increment: 10 } }
       });
    }
    return updated;
  }

  async purchaseGames(userId: string, cartItems: { gameId: string, quantity: number }[]) {
     let total = 0;
     const itemsToCreate = [];

     for (const item of cartItems) {
        const game = await prisma.game.findUnique({ where: { id: item.gameId } });
        if (!game || !game.price) throw new Error(`Juego ${item.gameId} no disponible para venta`);
        if (game.stockVenta < item.quantity) throw new Error(`Stock insuficiente para ${game.name}`);

        const subtotal = game.price * item.quantity;
        total += subtotal;

        itemsToCreate.push({
           gameId: game.id,
           quantity: item.quantity,
           priceUnit: game.price,
           subtotal
        });

        // Reducir stock
        await prisma.game.update({
           where: { id: game.id },
           data: { stockVenta: { decrement: item.quantity } }
        });
     }

     return await prisma.venta.create({
        data: {
           userId,
           total,
           items: {
              create: itemsToCreate
           }
        },
        include: { items: { include: { game: true } } }
     });
  }
}
