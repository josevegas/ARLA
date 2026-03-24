"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ReservationService {
    async createReservation(data) {
        return await prisma.reservation.create({
            data: {
                userId: data.userId,
                tableId: data.tableId,
                date: data.date,
                time: data.time,
                peopleCount: data.peopleCount,
                prepayment: data.prepayment,
                shareTable: data.shareTable,
                games: data.gameIds && data.gameIds.length > 0 ? {
                    connect: data.gameIds.map(id => ({ id }))
                } : undefined
            },
            include: {
                games: true
            }
        });
    }
    async findAvailableTable(data) {
        // 1. Get all tables that are big enough for the requested people count
        const possibleTables = await prisma.table.findMany({
            where: {
                capacity: {
                    gte: data.peopleCount
                }
            }
        });
        // 2. See existing reservations at that time to calculate occupied capacity
        const existingReservations = await prisma.reservation.findMany({
            where: {
                date: data.date,
                time: data.time
            },
            include: {
                games: true,
                user: true
            }
        });
        if (data.shareTable) {
            // Prioritize tables of 8 that already have players AND shareTable is true
            const tablesOf8 = possibleTables.filter(t => t.capacity === 8);
            for (const t of tablesOf8) {
                const reservationsForTable = existingReservations.filter(r => r.tableId === t.id);
                const occupied = reservationsForTable.reduce((acc, r) => acc + r.peopleCount, 0);
                const remaining = t.capacity - occupied;
                // If it has reservations and all of them allow sharing, AND there's enough space
                if (reservationsForTable.length > 0 && reservationsForTable.every(r => r.shareTable)) {
                    if (remaining >= data.peopleCount) {
                        return {
                            tableId: t.id,
                            capacity: t.capacity,
                            remainingCapacity: remaining,
                            joiningExisting: true,
                            existingGames: Array.from(new Set(reservationsForTable.flatMap(r => r.games.map(g => g.name)))),
                            existingUsers: Array.from(new Set(reservationsForTable.map(r => r.user?.name).filter(Boolean)))
                        };
                    }
                }
            }
        }
        // Otherwise, find an EMPTY table (sharing or not, we just need an empty one if we didn't join)
        // Preference: If not sharing, use capacity closest to peopleCount (e.g. 4 for 2-4 people).
        const sortedTables = possibleTables.sort((a, b) => a.capacity - b.capacity);
        for (const t of sortedTables) {
            const reservationsForTable = existingReservations.filter(r => r.tableId === t.id);
            const occupied = reservationsForTable.reduce((acc, r) => acc + r.peopleCount, 0);
            if (occupied === 0) {
                return {
                    tableId: t.id,
                    capacity: t.capacity,
                    remainingCapacity: t.capacity,
                    joiningExisting: false,
                    existingGames: [],
                    existingUsers: []
                };
            }
        }
        // At this point, no empty tables available.
        // As a fallback, if we allow sharing, maybe we have a table of 4 that is shared? 
        if (data.shareTable) {
            for (const t of possibleTables) {
                const reservationsForTable = existingReservations.filter(r => r.tableId === t.id);
                const occupied = reservationsForTable.reduce((acc, r) => acc + r.peopleCount, 0);
                const remaining = t.capacity - occupied;
                if (reservationsForTable.length > 0 && reservationsForTable.every(r => r.shareTable)) {
                    if (remaining >= data.peopleCount) {
                        return {
                            tableId: t.id,
                            capacity: t.capacity,
                            remainingCapacity: remaining,
                            joiningExisting: true,
                            existingGames: Array.from(new Set(reservationsForTable.flatMap(r => r.games.map(g => g.name)))),
                            existingUsers: Array.from(new Set(reservationsForTable.map(r => r.user?.name).filter(Boolean)))
                        };
                    }
                }
            }
        }
        return null; // Not enough capacity or no matching tables
    }
    async getReservations() {
        return await prisma.reservation.findMany({
            include: { user: true, table: true },
        });
    }
    async getReservationById(id) {
        return await prisma.reservation.findUnique({
            where: { id },
            include: { user: true, table: true },
        });
    }
    async updateReservation(id, data) {
        return await prisma.reservation.update({
            where: { id },
            data,
        });
    }
    async deleteReservation(id) {
        return await prisma.reservation.delete({ where: { id } });
    }
}
exports.ReservationService = ReservationService;
//# sourceMappingURL=reservationService.js.map