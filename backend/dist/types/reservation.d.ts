import { z } from 'zod';
export declare const createReservationSchema: z.ZodObject<{
    body: z.ZodObject<{
        userId: z.ZodOptional<z.ZodString>;
        tableId: z.ZodUnion<[z.ZodString, z.ZodString]>;
        date: z.ZodEffects<z.ZodString, Date, string>;
        time: z.ZodString;
        peopleCount: z.ZodNumber;
        prepayment: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        shareTable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        gameIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        shareTable: boolean;
        tableId: string;
        userId?: string | undefined;
        gameIds?: string[] | undefined;
    }, {
        date: string;
        time: string;
        peopleCount: number;
        tableId: string;
        prepayment?: boolean | undefined;
        shareTable?: boolean | undefined;
        userId?: string | undefined;
        gameIds?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        shareTable: boolean;
        tableId: string;
        userId?: string | undefined;
        gameIds?: string[] | undefined;
    };
}, {
    body: {
        date: string;
        time: string;
        peopleCount: number;
        tableId: string;
        prepayment?: boolean | undefined;
        shareTable?: boolean | undefined;
        userId?: string | undefined;
        gameIds?: string[] | undefined;
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
        shareTable: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
        gameIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        date?: Date | undefined;
        time?: string | undefined;
        peopleCount?: number | undefined;
        prepayment?: boolean | undefined;
        shareTable?: boolean | undefined;
        userId?: string | undefined;
        tableId?: string | undefined;
        gameIds?: string[] | undefined;
    }, {
        date?: string | undefined;
        time?: string | undefined;
        peopleCount?: number | undefined;
        prepayment?: boolean | undefined;
        shareTable?: boolean | undefined;
        userId?: string | undefined;
        tableId?: string | undefined;
        gameIds?: string[] | undefined;
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
        shareTable?: boolean | undefined;
        userId?: string | undefined;
        tableId?: string | undefined;
        gameIds?: string[] | undefined;
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
        shareTable?: boolean | undefined;
        userId?: string | undefined;
        tableId?: string | undefined;
        gameIds?: string[] | undefined;
    };
}>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>['body'];
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>['body'];
export declare const findTableSchema: z.ZodObject<{
    body: z.ZodObject<{
        date: z.ZodEffects<z.ZodString, Date, string>;
        time: z.ZodString;
        peopleCount: z.ZodNumber;
        shareTable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        date: Date;
        time: string;
        peopleCount: number;
        shareTable: boolean;
    }, {
        date: string;
        time: string;
        peopleCount: number;
        shareTable?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        date: Date;
        time: string;
        peopleCount: number;
        shareTable: boolean;
    };
}, {
    body: {
        date: string;
        time: string;
        peopleCount: number;
        shareTable?: boolean | undefined;
    };
}>;
export type FindTableInput = z.infer<typeof findTableSchema>['body'];
//# sourceMappingURL=reservation.d.ts.map