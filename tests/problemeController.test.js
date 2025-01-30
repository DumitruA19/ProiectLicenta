const request = require('supertest');
const app = require('../app');

describe('Probleme API', () => {
    test('Raportare problemă nouă', async () => {
        const res = await request(app)
            .post('/api/probleme')
            .send({ user_id: 1, sediu_id: 2, masina_id: 3, descriere: 'Problema test' });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Problemă raportată cu succes și notificare trimisă.');
    });

    test('Obține problemele raportate pentru un sediu', async () => {
        const res = await request(app).get('/api/probleme/2');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
