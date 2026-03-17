"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Protect all admin routes
router.use(auth_1.auth);
router.use((0, auth_1.authorize)(['ADMIN', 'SUPERADMIN']));
router.post('/menu', adminController_1.createMenuItem);
router.get('/menu', adminController_1.getMenuItems);
router.post('/promotions', adminController_1.createPromotion);
router.get('/promotions', adminController_1.getPromotions);
router.post('/games', adminController_1.createGame);
router.get('/games', adminController_1.getGames);
exports.default = router;
//# sourceMappingURL=admin.js.map