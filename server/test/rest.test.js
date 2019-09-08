process.env.NODE_ENV = 'test';

require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
chai.use(chaiHttp);

describe('REST', () => {

  describe('Rooms', () => {
    it('/GET rooms', (done) => {
      chai.request(server)
        .get('/rooms')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })
  })
  
  describe('Messages', () => {
  
  })
  
  describe('Users', () => {
    
  })
  
})