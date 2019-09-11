require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const { expect } = chai;

chai.use(chaiHttp);

module.exports = roomsSpecificTest = (roomId) => {
  return describe('Specific Room', () => {
    const path = '/rooms/' + roomId;

    it('/GET room', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          // check

          done();
        });
    });

    it('/PUT room', done => {
      chai.request(url)
        .put(path)
        .send({
          name: 'UpdatedName'
        })
        .end((err, res) => {
          // check
          

          done();
        })
    });

    it('/DELETE room', done => {
      chai.request(url)
        .delete(path)
        .end((err, res) => {
          // check

          done();
        });
    });

  });
}