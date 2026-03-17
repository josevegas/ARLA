import { z } from 'zod';
export declare const createReservationSchema: z.ZodObject<{
    body: z.ZodObject<{
        userId: z.ZodOptional<z.ZodString>;
        tableId: z.ZodUnion<[z.ZodString, z.ZodString]>;
        date: z.ZodEffects<z.ZodString, Date, string>;
        time: z.ZodString;
        peopleCount: z.ZodNumber;
        prepayment: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        tableId: string;
        userId?: string | undefined;
    }, {
        date: string;
        time: string;
        peopleCount: number;
        tableId: string;
        prepayment?: boolean | undefined;
        userId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        tableId: string;
        userId?: string | undefined;
    };
}, {
    body: {
        date: string;
        time: string;
        peopleCount: number;
        tableId: string;
        prepayment?: boolean | undefined;
        userId?: string | undefined;
    };
}>;
export declare const updateReservationSchema: z.ZodObject<{
    body: z.ZodObject<{
        userId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        tableId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
        date: z.ZodOptional<z.ZodEffects<z.ZodString, Date, string>>;
        time: z.ZodOptional<z.ZodString>;
        peopleCount: z.ZodOptional<z.ZodNumber>;
        prepayment: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    }, "strip", z.ZodTypeAny, {
        date?: Date | undefined;
        time?: string | undefined;
        peopleCount?: number | undefined;
        prepayment?: boolean | undefined;
        userId?: string | undefined;
        tableId?: string | undefined;
    }, {
        date?: string | undefined;
        time?: string | undefined;
        peopleCount?: number | undefined;
        prepayment?: boolean | undefined;
        userId?: string | undefined;
        tableId?: string | undefined;
    }>;
    params: z.ZodObject<{
        id: z.ZodUnion<[z.ZodString, z.ZodString]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        date?: Date | undefined;
        time?: string | undefined;
        peopleCount?: number | undefined;
        prepayment?: boolean | undefined;
        userId?: string | undefined;
        tableId?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        date?: string | undefined;
        time?: string | undefined;
        peopleCount?: number | undefined;
        prepayment?: boolean | undefined;
        userId?: string | undefined;
        tableId?: string | undefined;
    };
}>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>['body'];
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>['body'];
//# sourceMappingURL=reservation.d.ts.map