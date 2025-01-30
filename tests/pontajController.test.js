const request = require('supertest');
const app = require('../app');

describe('Pontaj API', () => {
    test('Creare pontaj nou', async () => {
        const res = await request(app)
            .post('/api/pontaj')
            .send({ user_id: 1, masina_id: 2, type: 'start', start_time: '2025-01-28', end_time: '2025-01-28', km_start: 1000, km_end: 1050, fuel_used: 5 });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Pontaj created successfully');
    });

    test('Obține toate pontajele', async () => {
        const res = await request(app).get('/api/pontaj');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
