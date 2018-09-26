process.env.NODE_ENV = 'test'

const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const { server } = require('../index')

chai.use(chaiHttp)

describe('api requests', () => {
    var agent = chai.request.agent(server);
    let authorization;

    after(()=>{
        agent.close()
    })

    describe('permission: #any', () => {

        beforeEach(() => {
            authorization = agent.post('/login')
                .send({
                    username: 'iris',
                    password: '123'
                })
        })

        describe('/logout', () => {
            it('should return 200', (done) => {
                authorization
                    .then((res) => {
                        expect(res).to.have.cookie('token');
                        return agent.get('/logout')
                            .then((res) => {
                                expect(res).to.have.status(200);
                                done()
                            })
                    })
            });
            describe('/logout', () => {
                it('should return 404', (done) => {
                    authorization
                        .then((res) => {
                            expect(res).to.have.cookie('token');
                            return agent.get('/logout')
                                .then((res) => {
                                    return agent.get('/logout')
                                        .then(res => {
                                            expect(res).to.have.status(401);
                                            done();
                                        })
                                })
                        })
                });
            })
        })
    })

    describe('permission: #user', () => {
        beforeEach(() => {
            authorization = agent.post('/login')
                .send({
                    username: 'mel',
                    password: '123'
                })
        })
        describe('/users', ()=>{
            it('should return a status code of 400 (unauthorized)', (done)=>{
                authorization
                    .then((res) => {
                        expect(res).to.have.cookie('token');
                        return agent.get('/users')
                            .then((res) => {
                                expect(res).to.have.status(400);
                                done()
                            })
                    })
            })
        })
    })

    describe('permission: #admin', () => {

        beforeEach(() => {
            authorization = agent.post('/login')
                .send({
                    username: 'iris',
                    password: '123'
                })
        })
        describe('/users', () => {
            it('should return status 200', (done) => {
                authorization
                    .then((res) => {
                        expect(res).to.have.cookie('token');
                        return agent.get('/users')
                            .then((res) => {
                                expect(res).to.have.status(200);
                                done()
                            })
                    })
            });

            it('should return a list of 4', (done) => {
                authorization
                    .then((res) => {
                        expect(res).to.have.cookie('token');
                        return agent.get('/users')
                            .then((res) => {
                                expect(res.body).to.be.an('array').of.length(4)
                                done()
                            })
                    })
            });
        })
    });
});
 /*
  * Test the /GET/:id route
  */