"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const authService = new authService_1.AuthService();
const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const user = await authService.getProfile(req.user.id);
        res.json(user);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map