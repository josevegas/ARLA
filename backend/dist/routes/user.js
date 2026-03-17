"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/history', auth_1.auth, userController_1.getUserHistory);
exports.default = router;
//# sourceMappingURL=user.js.map