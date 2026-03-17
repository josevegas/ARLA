import { Request, Response } from 'express';
export declare const createReservation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getReservations: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getReservationById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateReservation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteReservation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=reservationController.d.ts.map