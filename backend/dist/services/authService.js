"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
class AuthService {
    async register(data) {
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        return await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }
    async login(email, pass) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error('User not found');
        const isValid = await bcryptjs_1.default.compare(pass, user.password);
        if (!isValid)
            throw new Error('Invalid password');
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        return { user, token };
    }
    async getProfile(userId) {
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
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map