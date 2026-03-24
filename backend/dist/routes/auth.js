"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const authSchema_1 = require("../schemas/authSchema");
const router = (0, express_1.Router)();
router.post('/register', (0, validation_1.validate)(authSchema_1.registerSchema), authController_1.register);
router.post('/login', (0, validation_1.validate)(authSchema_1.loginSchema), authController_1.login);
router.get('/profile', auth_1.auth, authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map