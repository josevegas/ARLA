"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const adminSchema_1 = require("../schemas/adminSchema");
const router = (0, express_1.Router)();
// Publicly readable menu and games (optional, depending on requirement, but user asked for CRUD for admin)
// For now, let's keep all protected as they were, but add the new ones.
router.get('/menu', adminController_1.getMenuItems);
router.get('/promotions', adminController_1.getPromotions);
router.get('/games', adminController_1.getGames);
router.get('/game-categories', adminController_1.getCategories);
router.get('/game-difficulties', adminController_1.getDifficulties);
// Protect write routes
router.use(auth_1.auth);
router.use((0, auth_1.authorize)(['ADMIN', 'SUPERADMIN']));
router.post('/menu', (0, validation_1.validate)(adminSchema_1.menuItemSchema), adminController_1.createMenuItem);
router.put('/menu/:id', (0, validation_1.validate)(adminSchema_1.menuItemSchema), adminController_1.updateMenuItem);
router.delete('/menu/:id', adminController_1.deleteMenuItem);
router.post('/promotions', (0, validation_1.validate)(adminSchema_1.promotionSchema), adminController_1.createPromotion);
router.put('/promotions/:id', (0, validation_1.validate)(adminSchema_1.promotionSchema), adminController_1.updatePromotion);
router.delete('/promotions/:id', adminController_1.deletePromotion);
router.post('/games', (0, validation_1.validate)(adminSchema_1.gameSchema), adminController_1.createGame);
router.put('/games/:id', (0, validation_1.validate)(adminSchema_1.gameSchema), adminController_1.updateGame);
router.delete('/games/:id', adminController_1.deleteGame);
router.get('/tables', adminController_1.getTables);
router.post('/tables', (0, validation_1.validate)(adminSchema_1.tableSchema), adminController_1.createTable);
router.put('/tables/:id', (0, validation_1.validate)(adminSchema_1.tableSchema), adminController_1.updateTable);
router.delete('/tables/:id', adminController_1.deleteTable);
exports.default = router;
//# sourceMappingURL=admin.js.map