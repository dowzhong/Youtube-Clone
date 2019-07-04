require('dotenv').config();

const { expect } = require('chai');
const request = require('superagent');
require('../server.js');

describe('Server functions', () => {
    it('Correctly grabs video data', async () => {
        const { body } = await request
            .get(`http://localhost:4000/videos`);
        expect(body.success).to.equal(true);
    })

    it('Correctly authenticates', async () => {
        const { body } = await request
            .post(`http://localhost:4000/authenticate`)
            .send({ username: 'dow', password: 't' })
        expect(body.success).to.equal(true);
    })
})

