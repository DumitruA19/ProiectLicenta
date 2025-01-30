const request = require('supertest');
const app = require('../app');

describe('Notificari API', () => {
    test('Creare notificare nouă', async () => {
        const res = await request(app)
            .post('/api/notificari')
            .send({ recipient_id: 1, type: 'email', message: 'Test notification' });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Notificare creată cu succes.');
    });

    test('Obține notificările unui utilizator', async () => {
        const res = await request(app).get('/api/notificari/1');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
