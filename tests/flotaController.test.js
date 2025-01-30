const request = require('supertest');
const app = require('../app');
const { poolPromise } = require('../config/dbConfig');

describe('Flota API', () => {

    let createdCarId; // Variabilă pentru a reține ID-ul mașinii create

    beforeAll(async () => {
        const pool = await poolPromise;
        // Curăță baza de date înainte de teste
        await pool.request().query(`
            DELETE FROM flota WHERE nr_inmatriculare = 'B123XYZ' OR serie_sasiu = 'VIN123450009'
        `);
    });

    afterAll(async () => {
        const pool = await poolPromise;
        // Șterge toate datele de test
        await pool.request().query(`
            DELETE FROM flota WHERE nr_inmatriculare LIKE 'B%' OR serie_sasiu LIKE 'VIN%'
        `);
        await pool.close(); // Închide conexiunea la baza de date
    });

    test('Creare mașină nouă', async () => {
        const uniqueNrInmatriculare = `B${Math.floor(Math.random() * 1000000)}`;
        const uniqueSerieSasiu = `VIN${Date.now()}`;
        const res = await request(app)
            .post('/api/flota')
            .send({
                marca: 'Dacia',
                model: 'Logan',
                nr_inmatriculare: uniqueNrInmatriculare,
                serie_sasiu: uniqueSerieSasiu,
                sediu_id: 1,
                fuel_type: 'Benzina',
                status: 'Utilizat'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Car added successfully');
        
        // Salvează ID-ul mașinii create pentru testele ulterioare
        createdCarId = res.body.id;
    });

    test('Obține toate mașinile', async () => {
        const res = await request(app).get('/api/flota');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('Actualizare mașină', async () => {
        if (!createdCarId) {
            console.warn('Testul de actualizare a fost sărit, deoarece nu există un ID valid.');
            return;
        }

        const res = await request(app)
            .put(`/api/flota/${createdCarId}`)
            .send({
                marca: 'Dacia',
                model: 'Duster',
                nr_inmatriculare: 'B123XYZ',
                fuel_type: 'Diesel',
                status: 'Neutilizat'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Car updated successfully');
    });

    test('Ștergere mașină', async () => {
        if (!createdCarId) {
            console.warn('Testul de ștergere a fost sărit, deoarece nu există un ID valid.');
            return;
        }

        const res = await request(app)
            .delete(`/api/flota/${createdCarId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Car deleted successfully');
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adaugă un mic delay pentru a evita "open handles"
    });
});
