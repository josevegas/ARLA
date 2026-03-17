import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserHistory = async (req: any, res: Response) => {
  try {
    const history = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        visitHistory: true,
        gameHistory: {
          include: { game: true }
        }
      }
    });
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
