process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;
const auth = require('../../authenticate');

const { expect } = chai;

chai.use(chaiHttp);

describe('Users', () => {
  const path = '/users';

  let userId;
  let contactId;
  let token;

  before((done) => {
    contactId = '5dc627c757408d3580935cfd';
    chai.request(url)
      .post('/auth/login')
      .send({
        username: 'test',
        password: '123123'
      })
      .end((err, res) => {
        token = res.body.token;
        userId = auth.jwtDecode(token)._id;
        done();
      })
  });

  it('/GET users', done => {
    chai.request(url)
      .get(path)
      .set('Authorization', `bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(2);

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

  /* it('/GET users/:id', done => {
    const currentPath = path + '/' + userId;

    chai.request(url)
      .get(currentPath)
      .set('Authorization', `bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'username');

        done();
      })
  }); */

  /* it('/PUT users/:id', done => {
    const currentPath = path + '/' + userId;
    const updatedUsername = '321312';

    chai.request(url)
      .put(currentPath)
      .set('Authorization', `bearer ${token}`)
      .send({
        username: updatedUsername
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'username');
        expect(res.body.username).to.be.equal(updatedUsername);

        done();
      })
  }) */

  it('/GET contacts', done => {
    const currentPath = path + '/contacts';

    chai.request(url)
      .get(currentPath)
      .set('Authorization', `bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(0);

        done();
      })
  })

  it('/POST contacts', done => {
    const currentPath = path + '/contacts';

    chai.request(url)
      .post(currentPath)
      .set('Authorization', `bearer ${token}`)
      .send({
        username: 'kasper' 
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(1);

        done();
      })
  })

  it('/DELETE contacts/:id', done => {
    const currentPath = path + '/contacts/' + contactId;

    chai.request(url)
      .delete(currentPath)
      .set('Authorization', `bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(0);

        done();
      })
  })

  it('/DELETE users/:id', done => {
    const currentPath = path + '/' + userId;

    chai.request(url)
      .delete(currentPath)
      .set('Authorization', `bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'username');

        done();
      })
  })

  /* it('/DELETE users', done => {
    chai.request(url)
      .delete(path)
      .set('Authorization', `bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.be.empty;

        done();
      });
  }); */

});