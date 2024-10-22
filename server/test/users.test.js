import { strict as assert } from 'assert';
import request from 'supertest';
import app from '../app.js';

describe('User Registration API', () => {
    it('should require a username', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                username: '',
                email: 'test@example.com',
                password: 'password123',
                bio: 'Hello World'
            });

        assert.equal(response.status, 400);
        assert.ok(response.body.error); // Check if error exists
        assert.strictEqual(response.body.error, 'Username required'); // Check for specific error message
    });

    it('should require a valid email', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                username: 'testuser',
                email: 'invalid-email',
                password: 'password123',
                bio: 'Hello World'
            });

        assert.equal(response.status, 400);
        assert.ok(response.body.error); // Check if error exists
        assert.strictEqual(response.body.error, 'Please Enter a Valid Email Address.'); // Check for specific error message
    });

    it('should require a password with at least 6 characters', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'pass',
                bio: 'Hello World'
            });

        assert.equal(response.status, 400); // Expect 400 status
        assert.strictEqual(response.body.error.includes('Password must be at least 6 characters'), true); // Check for error message
    });

    it('should create a user with valid data', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                username: `testuser-${Date.now()}`,
                password: 'password123', // Use a valid password
                email: `test${Date.now()}@example.com`,
                bio: 'Hello World'
            });

        assert.equal(response.status, 201); // Expect 201 status
        assert.strictEqual(response.body.message, 'User created successfully'); // Check success message
    });
});