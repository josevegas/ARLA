export declare class AdminService {
    createMenuItem(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        category: string;
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
        available: boolean;
    }>;
    createPromotion(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        discount: number;
        startDate: Date;
        endDate: Date;
        active: boolean;
    }>;
    getPromotions(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        discount: number;
        startDate: Date;
        endDate: Date;
        active: boolean;
    }[]>;
    updatePromotion(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        discount: number;
        startDate: Date;
        endDate: Date;
        active: boolean;
    }>;
    deletePromotion(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        discount: number;
        startDate: Date;
        endDate: Date;
        active: boolean;
    }>;
    createGame(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        difficulty: import(".prisma/client").$Enums.Difficulty;
        duration: number;
        stock: number;
    }>;
    getGames(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        difficulty: import(".prisma/client").$Enums.Difficulty;
        duration: number;
        stock: number;
    }[]>;
    updateGame(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        difficulty: import(".prisma/client").$Enums.Difficulty;
        duration: number;
        stock: number;
    }>;
    deleteGame(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        difficulty: import(".prisma/client").$Enums.Difficulty;
        duration: number;
        stock: number;
    }>;
}
//# sourceMappingURL=adminService.d.ts.map