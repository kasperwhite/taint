require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;
const { mongoUrl } = require('../config');

chai.use(chaiHttp);

const url = 'http://localhost:3000';

describe('REST', () => {

  // Check USERS
  describe('Users', () => {
    const path = '/users'

    it('/GET users', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          // check

          done();
        });
    });

    it('/DELETE users', done => {
      chai.request(url)
        .delete(path)
        .end((err, res) => {
          // check

          done();
        });
    });
  
  });

  // Check ROOMS
  describe('Rooms', () => {
    const path = '/rooms';

    it('/GET rooms', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          // check

          done();
        });
    });

  });
  
  // Check MESSAGES
  describe('Messages', () => {
    const path = '/messages'

    it('/GET messages', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          // check

          done()
        });
    });

  });
  
});