export declare class AuthService {
    register(data: any): Promise<{
        id: string;
        email: string;
        password: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(email: string, pass: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<({
        visitHistory: {
            id: string;
            createdAt: Date;
            date: Date;
            userId: string;
        }[];
        gameHistory: ({
            game: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                difficulty: import(".prisma/client").$Enums.Difficulty;
                duration: number;
                stock: number;
            };
        } & {
            id: string;
            date: Date;
            userId: string;
            gameId: string;
        })[];
    } & {
        id: string;
        email: string;
        password: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
//# sourceMappingURL=authService.d.ts.map