"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservationController_1 = require("../controllers/reservationController");
const validation_1 = require("../middlewares/validation");
const reservation_1 = require("../types/reservation");
const router = (0, express_1.Router)();
router.post('/', (0, validation_1.validate)(reservation_1.createReservationSchema), reservationController_1.createReservation);
router.get('/', reservationController_1.getReservations);
router.get('/:id', reservationController_1.getReservationById);
router.put('/:id', (0, validation_1.validate)(reservation_1.updateReservationSchema), reservationController_1.updateReservation);
router.delete('/:id', reservationController_1.deleteReservation);
exports.default = router;
//# sourceMappingURL=reservations.js.map