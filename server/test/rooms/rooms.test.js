require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const { expect } = chai;

chai.use(chaiHttp);

module.exports = roomsTest = () => {
  return describe('Rooms', () => {
    const path = '/rooms';
    let userId;
    let roomId;

    before((done) => {
      chai.request(url)
        .post('/users')
        .send({
          login: 'TestUser',
          password: '123123'
        })
        .end((err, res) => {
          // check
          userId = res.body._id;

          done();
        })
    })

    after((done) => {
      chai.request(url)
        .delete('/users')
        .end((err, res) => {
          done()
        })
    })

    it('/GET rooms', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.equal(0);

          done();
        });
    });

    it('/POST rooms', done => {
      chai.request(url)
        .post(path)
        .send({
          name: 'TestRoom',
          creator: userId,
          users: []
        })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.all.keys('_id', 'name', 'creator', 'messages', 'keys');
          expect(res.body.users.length).to.be.equal(1);

          done();
        })
    });

    it('/DELETE rooms', done => {
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