import { Request, Response } from 'express';
import { ReservationService } from '../services/reservationService';

const reservationService = new ReservationService();

export const createReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    return res.status(201).json(reservation);
  } catch (error) {
    console.error(`[createReservation]: ${error}`);
    return res.status(500).json({ message: 'Internal server error while creating reservation' });
  }
};

export const getReservations = async (_req: Request, res: Response) => {
  try {
    const reservations = await reservationService.getReservations();
    return res.json(reservations);
  } catch (error) {
    console.error(`[getReservations]: ${error}`);
    return res.status(500).json({ message: 'Internal server error while fetching reservations' });
  }
};

export const getReservationById = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    return res.json(reservation);
  } catch (error) {
    console.error(`[getReservationById]: ${error}`);
    return res.status(500).json({ message: 'Internal server error while fetching reservation' });
  }
};

export const updateReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.updateReservation(req.params.id, req.body);
    return res.json(reservation);
  } catch (error) {
    console.error(`[updateReservation]: ${error}`);
    return res.status(500).json({ message: 'Internal server error while updating reservation' });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    await reservationService.deleteReservation(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error(`[deleteReservation]: ${error}`);
    return res.status(500).json({ message: 'Internal server error while deleting reservation' });
  }
};