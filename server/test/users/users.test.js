require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const { expect } = chai;

chai.use(chaiHttp);

module.exports = usersTest = () => {
  return describe('Users', () => {
    const path = '/users';

    it('/GET users', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.equal(0);

          done();
        });
    });

    it('/POST users', done => {
      const password = '123123';
      chai.request(url)
        .post(path)
        .send({
          login: 'TestUser',
          password
        })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.all.keys('_id', 'login', 'password');
          expect(res.body.password).to.not.equal(password);

          done();
        })
    });

    it('/DELETE users', done => {
      chai.request(url)
        .delete(path)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('n', 'ok', 'deletedCount');

          done();
        });
    });

  });
}