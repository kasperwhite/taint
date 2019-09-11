require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const { expect } = chai;

chai.use(chaiHttp);

module.exports = usersSpecificTest = (userId) => {
  return describe('Specific User', () => {
    const path = `/users/${userId}`;
    
    it('/GET user', done => {
      const path = `/users/${userId}`;
      chai.request(url)
        .get(path)
        .end((err, res) => {
          // check

          done();
        });
    });

    it('/PUT user', done => {
      chai.request(url)
        .put(path)
        .send({
          password: '123123'
        })
        .end((err, res) => {
          // check
          

          done();
        })
    });

    it('/DELETE user', done => {
      chai.request(url)
        .delete(path)
        .end((err, res) => {
          // check

          done();
        });
    });
  
})
}