import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReservationService {
  async createReservation(data: {
    userId?: string;
    tableId: string;
    date: Date;
    time: string;
    peopleCount: number;
    prepayment?: boolean;
  }) {
    return await prisma.reservation.create({ data });
  }

  async getReservations() {
    return await prisma.reservation.findMany({
      include: { user: true, table: true },
    });
  }

  async getReservationById(id: string) {
    return await prisma.reservation.findUnique({
      where: { id },
      include: { user: true, table: true },
    });
  }

  async updateReservation(id: string, data: Partial<typeof data>) {
    return await prisma.reservation.update({
      where: { id },
      data,
    });
  }

  async deleteReservation(id: string) {
    return await prisma.reservation.delete({ where: { id } });
  }
}