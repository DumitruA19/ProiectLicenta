const request = require('supertest');
const app = require('../app');

describe('Reparații API', () => {
    test('Creare reparație nouă', async () => {
        const res = await request(app)
            .post('/api/reparatii')
            .send({ masina_id: 1, user_id: 2, start_date: '2025-01-01', status: 'pending' });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Reparation added successfully');
    });

    test('Obține toate reparațiile', async () => {
        const res = await request(app).get('/api/reparatii');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
