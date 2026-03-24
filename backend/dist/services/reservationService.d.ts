export declare class ReservationService {
    createReservation(data: {
        userId?: string;
        tableId: string;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment?: boolean;
        shareTable?: boolean;
        gameIds?: string[];
    }): Promise<{
        games: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            imageUrl: string | null;
            minPlayers: number | null;
            maxPlayers: number | null;
            duration: number | null;
            stock: number;
            difficultyId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        shareTable: boolean;
        userId: string | null;
        tableId: string;
    }>;
    findAvailableTable(data: {
        date: Date;
        time: string;
        peopleCount: number;
        shareTable: boolean;
    }): Promise<{
        tableId: string;
        capacity: number;
        remainingCapacity: number;
        joiningExisting: boolean;
        existingGames: string[];
        existingUsers: (string | null | undefined)[];
    } | null>;
    getReservations(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            lastName: string | null;
            phone: string | null;
            birthday: string | null;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.Status;
            description: string;
            capacity: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        shareTable: boolean;
        userId: string | null;
        tableId: string;
    })[]>;
    getReservationById(id: string): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            lastName: string | null;
            phone: string | null;
            birthday: string | null;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.Status;
            description: string;
            capacity: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        time: string;
        peopleCount: number;
        prepayment: boolean;
        shareTable: boolean;
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
        shareTable: boolean;
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
        shareTable: boolean;
        userId: string | null;
        tableId: string;
    }>;
}
//# sourceMappingURL=reservationService.d.ts.map