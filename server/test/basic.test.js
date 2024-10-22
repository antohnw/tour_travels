// // import { expect } from 'chai';

// // describe('Basic Test', () => {
// //     it('should return true', () => {
// //         expect(true).to.be.true;
// //     });
// // });
// import { strict as assert } from 'assert'; // Import assert
// import request from 'supertest'; // For making HTTP requests
// import app from '../app.js'; // Adjust the path as necessary

// describe('Basic Test', () => {
//     it('should return true', () => {
//         assert.equal(true, true); // Basic assertion
//     });

//     it('should return a 200 status from the /destinations endpoint', async () => {
//         const response = await request(app).get('/destinations'); // Modify this to your desired endpoint
//         assert.equal(response.status, 200); // Expect a 200 status
//     });
// });