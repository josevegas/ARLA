import request from 'supertest';
import app from '../src/server';
import { AdminService } from '../src/services/adminService';

// Mock the auth middleware to pass through
jest.mock('../src/middlewares/auth', () => ({
  auth: (req: any, res: any, next: any) => next(),
  authorize: (roles: string[]) => (req: any, res: any, next: any) => next(),
}));

// IMPORTANT: These tests are fully MOCKED. 
// They do NOT interact with the live PostgreSQL database and will NOT delete or modify real data.
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      game: {
        create: jest.fn().mockResolvedValue({ id: '1', name: 'Test Game' }),
        update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated Game' }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      menuItem: {
        create: jest.fn().mockResolvedValue({ id: '1', name: 'Test Food' }),
        update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated Food' }),
      },
    })),
  };
});

describe('Admin CRUD Procedures', () => {
  it('should successfully update a game', async () => {
    const response = await request(app)
      .put('/api/admin/games/1')
      .send({
        name: 'Updated Game',
        description: 'New Description',
        categoryIds: ['cat1'],
        difficultyId: 'diff1',
        stock: 5
      });
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Game');
  });

  it('should fail if required fields are missing in game update (Validation)', async () => {
    const response = await request(app)
      .put('/api/admin/games/1')
      .send({
        // missing name which is required by schema min(2)
        description: 'No name'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should successfully update a menu item', async () => {
    const response = await request(app)
      .put('/api/admin/menu/1')
      .send({
        name: 'Delicious Pizza',
        price: 15.5,
        category: 'Pizzas'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Food'); // Matches mock
  });
});
