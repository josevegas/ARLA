import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {
  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        emailVerified: false
      },
    });

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.verificationCode.create({
      data: {
        email: user.email,
        code,
        expiresAt
      }
    });

    // Mock email sending: Log to console
    console.log(`[EMAIL MOCK] Verification code for ${user.email}: ${code}`);

    return { message: 'Verification code sent to email', email: user.email };
  }

  async verifyCode(email: string, code: string) {
    const record = await prisma.verificationCode.findFirst({
      where: { email, code, expiresAt: { gte: new Date() } }
    });

    if (!record) throw new Error('Invalid or expired verification code');

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });

    // Clear used code
    await prisma.verificationCode.delete({ where: { id: record.id } });

    return { message: 'Account verified successfully' };
  }

  async login(email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    if (!user.emailVerified) throw new Error('Account not verified. Please check your email.');

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new Error('Invalid password');

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  async getProfile(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        visitHistory: true,
        gameHistory: {
          include: { game: true }
        }
      }
    });
  }
}
