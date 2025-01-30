const request = require('supertest');
const app = require('../app');
const { poolPromise } = require('../config/dbConfig');
const jwt = require('jsonwebtoken');

describe('Users API', () => {
    let server;
    let createdUserId;
    let authToken;

    const generateAuthToken = () => {
        return jwt.sign(
            { id: 1, email: 'admin@example.com', role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    };

    beforeAll(() => {
        server = app.listen(5001);
        authToken = generateAuthToken();
    });

    afterAll(async () => {
        const pool = await poolPromise;
        await pool.close();
        await server.close();
    });

    test('Fetch all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

 
    test('Create a new user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'Test123!',
                role: 'user',
                employee_type: 'contractor',
                sediu_id: 1,
                phone: '1234567890',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User created successfully.');
        createdUserId = res.body.id; // Salvează ID-ul utilizatorului
    });

test('Login with valid credentials', async () => {
    const res = await request(app)
        .post('/api/users/login')
        .send({
            email: 'testuser2@example.com',
            password: 'Test123!',
        });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
});


    test('Login with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'nonexistentuser@example.com',
                password: 'WrongPassword123',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid email or password.');
    });

    test('Update a user', async () => {
        if (!createdUserId) {
            console.warn('Skipping update user test - no valid user ID.');
            return;
        }

        const res = await request(app)
            .put(`/api/users/${createdUserId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Updated Test User',
                role: 'admin',
                is_active: true,
                phone: '0987654321',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User updated successfully.');
    });

    test('Deactivate a user', async () => {
        if (!createdUserId) {
            console.warn('Skipping deactivate user test - no valid user ID.');
            return;
        }

        const res = await request(app)
            .delete(`/api/users/${createdUserId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User deactivated successfully.');
    });

    test('Delete a user permanently', async () => {
        if (!createdUserId) {
            console.warn('Skipping delete user test - no valid user ID.');
            return;
        }

        const res = await request(app)
            .delete(`/api/users/delete/${createdUserId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User deleted successfully.');
    });
});
