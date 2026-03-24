import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReservationService {
  async createReservation(data: {
    userId?: string;
    tableId: string;
    date: Date;
    time: string;
    peopleCount: number;
    playerNames: string[];
    prepayment?: boolean;
    shareTable?: boolean;
    gameIds?: string[];
  }) {
    return await prisma.reservation.create({ 
      data: {
        userId: data.userId,
        tableId: data.tableId,
        date: data.date,
        time: data.time,
        peopleCount: data.peopleCount,
        playerNames: data.playerNames,
        prepayment: data.prepayment,
        shareTable: data.shareTable,
        games: data.gameIds && data.gameIds.length > 0 ? {
          connect: data.gameIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        games: true,
        table: true
      }
    });
  }

  async findAvailableTables(data: { date: Date, time: string, peopleCount: number, shareTable: boolean }) {
    // 1. Get all tables
    const tables = await prisma.table.findMany();

    // 2. Get reservations for that day/time
    const dayReservations = await prisma.reservation.findMany({
      where: {
        date: data.date,
        time: data.time
      },
      include: {
        games: true
      }
    });

    const results = [];

    for (const table of tables) {
      const tableReservations = dayReservations.filter(r => r.tableId === table.id);
      const occupiedSpots = tableReservations.reduce((acc, r) => acc + r.peopleCount, 0);
      const remainingCapacity = table.capacity - occupiedSpots;

      // Rule: Never exceed capacity
      if (remainingCapacity < data.peopleCount) continue;

      // Logic check for share vs exclusive
      const isEmpty = occupiedSpots === 0;
      const allowsSharing = tableReservations.every(r => r.shareTable);

      if (data.shareTable) {
        // If user wants to share, they can join if either the table is empty OR existing people at table are sharing too
        if (isEmpty || allowsSharing) {
          results.push({
            id: table.id,
            name: table.description,
            capacity: table.capacity,
            availableSpots: remainingCapacity,
            currentPlayers: tableReservations.flatMap(r => r.playerNames),
            currentGames: Array.from(new Set(tableReservations.flatMap(r => r.games.map(g => g.name)))),
            isFullyEmpty: isEmpty
          });
        }
      } else {
        // If user wants exclusive, table must be COMPLETELY empty
        if (isEmpty) {
          results.push({
            id: table.id,
            name: table.description,
            capacity: table.capacity,
            availableSpots: table.capacity,
            currentPlayers: [],
            currentGames: [],
            isFullyEmpty: true
          });
        }
      }
    }

    // Sort by "tightest fit": smallest available spots (that still fits)
    return results.sort((a, b) => a.availableSpots - b.availableSpots);
  }

  async getActiveReservationForUser(userId: string) {
    // Current or future reservation (simplified to any reservation for today onwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.reservation.findFirst({
      where: {
        userId,
        date: {
          gte: today
        }
      },
      orderBy: {
        date: 'asc'
      },
      include: {
        table: true,
        games: true
      }
    });
  }

  async getReservations() {
    return await prisma.reservation.findMany({
      include: { user: true, table: true, games: true },
    });
  }

  async getReservationById(id: string) {
    return await prisma.reservation.findUnique({
      where: { id },
      include: { user: true, table: true, games: true },
    });
  }

  async updateReservation(id: string, data: any) {
    const { gameIds, ...rest } = data;
    return await prisma.reservation.update({
      where: { id },
      data: {
        ...rest,
        games: gameIds ? {
          set: gameIds.map((id: string) => ({ id }))
        } : undefined
      },
    });
  }

  async deleteReservation(id: string) {
    return await prisma.reservation.delete({ where: { id } });
  }
}