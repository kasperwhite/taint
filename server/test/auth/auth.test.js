process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const { expect } = chai;

chai.use(chaiHttp);

describe('Authenticate', () => {
  const path = '/auth';

  it('/POST auth/signup', (done) => {
    const currentPath = path + '/signup';
    chai.request(url)
      .post(currentPath)
      .send({
        username: 'testtest',
        password: '123123123123'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('success');
        expect(res.body.success).to.be.equal(true);

        done();
      })
  })

  it('/POST auth/signin', (done) => {
    const currentPath = path + '/signin';
    chai.request(url)
      .post(currentPath)
      .send({
        username: 'testtest',
        password: '123123123123'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('success', 'token');
        expect(res.body.success).to.be.equal(true);

        done();
      })
  })
})