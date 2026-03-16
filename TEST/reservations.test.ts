import request from 'supertest';
import app from '../backend/src/server';

describe('Reservations API', () => {
  it('should create a reservation', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .send({
        tableId: 'some-table-id',
        date: '2023-12-01',
        time: '14:00',
        peopleCount: 4,
        prepayment: true,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should get all reservations', async () => {
    const response = await request(app).get('/api/reservations');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});