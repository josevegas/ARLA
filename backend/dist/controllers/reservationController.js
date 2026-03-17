"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReservation = exports.updateReservation = exports.getReservationById = exports.getReservations = exports.createReservation = void 0;
const reservationService_1 = require("../services/reservationService");
const reservationService = new reservationService_1.ReservationService();
const createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.body);
        return res.status(201).json(reservation);
    }
    catch (error) {
        console.error(`[createReservation]: ${error}`);
        return res.status(500).json({ message: 'Internal server error while creating reservation' });
    }
};
exports.createReservation = createReservation;
const getReservations = async (_req, res) => {
    try {
        const reservations = await reservationService.getReservations();
        return res.json(reservations);
    }
    catch (error) {
        console.error(`[getReservations]: ${error}`);
        return res.status(500).json({ message: 'Internal server error while fetching reservations' });
    }
};
exports.getReservations = getReservations;
const getReservationById = async (req, res) => {
    try {
        const reservation = await reservationService.getReservationById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        return res.json(reservation);
    }
    catch (error) {
        console.error(`[getReservationById]: ${error}`);
        return res.status(500).json({ message: 'Internal server error while fetching reservation' });
    }
};
exports.getReservationById = getReservationById;
const updateReservation = async (req, res) => {
    try {
        const reservation = await reservationService.updateReservation(req.params.id, req.body);
        return res.json(reservation);
    }
    catch (error) {
        console.error(`[updateReservation]: ${error}`);
        return res.status(500).json({ message: 'Internal server error while updating reservation' });
    }
};
exports.updateReservation = updateReservation;
const deleteReservation = async (req, res) => {
    try {
        await reservationService.deleteReservation(req.params.id);
        return res.status(204).send();
    }
    catch (error) {
        console.error(`[deleteReservation]: ${error}`);
        return res.status(500).json({ message: 'Internal server error while deleting reservation' });
    }
};
exports.deleteReservation = deleteReservation;
//# sourceMappingURL=reservationController.js.map