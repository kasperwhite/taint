require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const roomsSpecificTest = require('./roomsSpecific.test');

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

    it('/GET rooms', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          // check

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
          // check
          roomId = res.body._id;

          done();
        })
    });

    roomsSpecificTest(roomId);

    it('/DELETE rooms', done => {
      chai.request(url)
        .delete(path)
        .end((err, res) => {
          // check

          done();
        });
    });

  });
}