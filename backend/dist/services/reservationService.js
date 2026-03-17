"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ReservationService {
    async createReservation(data) {
        return await prisma.reservation.create({ data });
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