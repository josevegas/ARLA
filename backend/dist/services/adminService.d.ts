export declare class AdminService {
    createMenuItem(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        category: string;
        imageUrl: string | null;
        available: boolean;
    }>;
    getMenuItems(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        category: string;
        imageUrl: string | null;
        available: boolean;
    }[]>;
    updateMenuItem(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        category: string;
        imageUrl: string | null;
        available: boolean;
    }>;
    deleteMenuItem(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        category: string;
        imageUrl: string | null;
        available: boolean;
    }>;
    createPromotion(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        imageUrl: string | null;
        title: string;
        discount: number;
        expirationDate: Date;
        active: boolean;
    }>;
    getPromotions(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        imageUrl: string | null;
        title: string;
        discount: number;
        expirationDate: Date;
        active: boolean;
    }[]>;
    updatePromotion(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        imageUrl: string | null;
        title: string;
        discount: number;
        expirationDate: Date;
        active: boolean;
    }>;
    deletePromotion(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        imageUrl: string | null;
        title: string;
        discount: number;
        expirationDate: Date;
        active: boolean;
    }>;
    createGame(data: any): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        difficulty: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
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
    }>;
    getGames(): Promise<({
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        difficulty: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
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
    })[]>;
    updateGame(id: string, data: any): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        difficulty: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
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
    }>;
    deleteGame(id: string): Promise<{
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
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getDifficulties(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createTable(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.Status;
        description: string;
        capacity: number;
    }>;
    getTables(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.Status;
        description: string;
        capacity: number;
    }[]>;
    updateTable(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.Status;
        description: string;
        capacity: number;
    }>;
    deleteTable(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.Status;
        description: string;
        capacity: number;
    }>;
}
//# sourceMappingURL=adminService.d.ts.map