require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const usersSpecificTest = require('./usersSpecific.test');

const { expect } = chai;

chai.use(chaiHttp);

module.exports = usersTest = () => {
  return describe('Users', () => {
    const path = '/users';
    var userId = '';

    it('/GET users', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          // check

          done();
        });
    });

    it('/POST users', done => {
      chai.request(url)
        .post(path)
        .send({
          login: 'TestUser',
          password: '123123'
        })
        .end((err, res) => {
          // check
          userId = res.body._id;

          done();
        })
    });

    usersSpecificTest(userId)

    it('/DELETE users', done => {
      chai.request(url)
        .delete(path)
        .end((err, res) => {
          // check

          done();
        });
    });

  });
}