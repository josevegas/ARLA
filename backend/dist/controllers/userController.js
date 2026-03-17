"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHistory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserHistory = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserHistory = getUserHistory;
//# sourceMappingURL=userController.js.map