import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';
import { sendVerificationEmail } from './mailService';

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

    // Send Real Email
    try {
      await sendVerificationEmail(user.email, code);
      return { message: 'Verification code sent to email', email: user.email };
    } catch (error) {
      console.error('Error sending verification email during registration:', error);
      // Even if email fails, user is created, but we should inform about the failure
      return { 
        message: 'Registration successful but failed to send email. Please request a new code.', 
        email: user.email,
        error: true
      };
    }
  }

  async verifyCode(email: string, code: string) {
    const record = await prisma.verificationCode.findFirst({
      where: { email, code, expiresAt: { gte: new Date() } }
    });

    if (!record) throw new Error('Invalid or expired verification code');

    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });

    // Clear used code
    await prisma.verificationCode.delete({ where: { id: record.id } });

    // Auto login
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { message: 'Account verified successfully', user, token };
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
        visitHistory: {
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });
  }

  async resendVerificationCode(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuario no encontrado');
    if (user.emailVerified) throw new Error('La cuenta ya está verificada');

    // Generate NEW 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update or Create
    await prisma.verificationCode.deleteMany({ where: { email } });
    await prisma.verificationCode.create({
      data: { email, code, expiresAt }
    });

    await sendVerificationEmail(email, code);
    return { message: 'Se ha enviado un nuevo código de verificación' };
  }
}
