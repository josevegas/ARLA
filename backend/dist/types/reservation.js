"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationSchema = exports.createReservationSchema = void 0;
const zod_1 = require("zod");
exports.createReservationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().optional(),
        tableId: zod_1.z.string().uuid('Invalid table ID format').or(zod_1.z.string().cuid()),
        date: zod_1.z.string().transform((val) => new Date(val)),
        time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
        peopleCount: zod_1.z.number().int().min(1, 'At least 1 person required').max(20, 'Max 20 people per reservation'),
        prepayment: zod_1.z.boolean().optional().default(false),
    }),
});
exports.updateReservationSchema = zod_1.z.object({
    body: exports.createReservationSchema.shape.body.partial(),
    params: zod_1.z.object({
        id: zod_1.z.string().cuid().or(zod_1.z.string().uuid()),
    }),
});
//# sourceMappingURL=reservation.js.map