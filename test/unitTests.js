const chaiAsPromised = require('chai-as-promised');
const { fetchSession } = require('../utils/userFunctions')
const chai = require('chai');
chai.use(chaiAsPromised)
const { expect } = chai;
process.env.NODE_ENV = 'test'

describe('utils tests', () => {

    describe('fetchSession', () => {
        describe('a valid session', () => {
            it('should return a json response', async () => {
                let request = {};
                request.auth = { credentials: { id: 1 } }
                let client = {
                    1: JSON.stringify({ test: 'test' }),
                    get: (id) => client[id]
                };
                let response = await fetchSession(client, request);
                expect(response).to.be.a('object');
            })
        })

        describe('invalid parameters', () => {
            it('two undefined values should throw an error', async () => {
                await expect(fetchSession(undefined, undefined)).to.eventually.be.rejectedWith(Error)
            })
            it('one undefined values should throw an error', async()=>{
                await expect(fetchSession({}, undefined)).to.eventually.be.rejectedWith(Error)
                await expect(fetchSession(undefined, {})).to.eventually.be.rejectedWith(Error)
            })

        })
    })

    describe



})