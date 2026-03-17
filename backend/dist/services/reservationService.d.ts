export declare class ReservationService {
    createReservation(data: {
        userId?: string;
        tableId: string;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        userId: string | null;
        tableId: string;
    }>;
    getReservations(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.Status;
            capacity: number;
            location: import(".prisma/client").$Enums.Location;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        userId: string | null;
        tableId: string;
    })[]>;
    getReservationById(id: string): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.Status;
            capacity: number;
            location: import(".prisma/client").$Enums.Location;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        userId: string | null;
        tableId: string;
    }) | null>;
    updateReservation(id: string, data: {
        userId?: string;
        tableId?: string;
        date?: Date;
        time?: string;
        peopleCount?: number;
        prepayment?: boolean;
        status?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        userId: string | null;
        tableId: string;
    }>;
    deleteReservation(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        userId: string | null;
        tableId: string;
    }>;
}
//# sourceMappingURL=reservationService.d.ts.map