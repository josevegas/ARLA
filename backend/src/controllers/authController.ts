import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyCode(email, code);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationCode(email);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
