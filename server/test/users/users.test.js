process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const { expect } = chai;

chai.use(chaiHttp);

describe('Users', () => {
  const path = '/users';

  let userId;
  let oldPassword;

  it('/GET users', done => {
    chai.request(url)
      .get(path)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(0);

        done();
      });
  });

  /* it('/POST users', done => {
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

        userId = res.body._id;

        done();
      })
  }); */

  it('/GET users/:id', done => {
    const currentPath = path + '/' + userId;

    chai.request(url)
      .get(currentPath)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'login', 'password');

        oldPassword = res.body.password;

        done();
      })
  });

  /* it('/PUT users/:id', done => {
    const currentPath = path + '/' + userId;
    const updatedPassword = '321312';

    chai.request(url)
      .put(currentPath)
      .send({
        password: updatedPassword
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'login', 'password');
        expect(res.body.password).to.not.equal(oldPassword);

        done();
      })
  }) */

  it('/DELETE users/:id', done => {
    const currentPath = path + '/' + userId;

    chai.request(url)
      .delete(currentPath)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'login', 'password');

        done();
      })
  })

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