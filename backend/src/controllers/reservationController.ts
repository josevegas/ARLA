import { Request, Response } from 'express';
import { ReservationService } from '../services/reservationService';

const reservationService = new ReservationService();

export const createReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation' });
  }
};

export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await reservationService.getReservations();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations' });
  }
};

export const getReservationById = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.getReservationById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservation' });
  }
};

export const updateReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.updateReservation(req.params.id, req.body);
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation' });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    await reservationService.deleteReservation(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reservation' });
  }
};