import request from 'supertest';
import express from 'express';
import authRoutes from '../src/routes/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  it('should have a login endpoint', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@arla.com', password: 'password' });
    
    // We expect 401 because user doesn't exist yet, but it proves route works
    expect(res.status).toBe(401);
  });

  it('should fail registration with invalid birthday format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ 
        email: 'new@arla.com', 
        password: 'password123',
        name: 'New',
        birthday: '32/13' // Invalid format
      });
    
    expect(res.status).toBe(400);
    expect(res.body.errors[0].message).toBe('Birthday must be in DD/MM format');
  });
});
