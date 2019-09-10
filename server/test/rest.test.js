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

    it('/POST users', done => {
      chai.request(url)
        .post(path)
        .send({
          login: 'TestUser',
          password: '123123'
        })
        .end((err, res) => {
          // check

          done();
        })
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

    it('/POST rooms', done => {
      chai.request(url)
        .post(path)
        .send({
          name: 'TestRoom',
          creator: 'testtesttest',
          users: []
        })
        .end((err, res) => {
          // check

          done();
        })
    });

    it('/DELETE rooms', done => {
      chai.request(url)
        .delete(path)
        .end((err, res) => {
          // check

          done();
        });
    });

    describe('Room Messages', () => {
      
      it('/GET messages', done => {
        chai.request(url)
          .get(path)
          .end((err, res) => {
            // check
  
            done()
          });
      });

      it('/POST messages', done => {
        chai.request(url)
          .post(path)
          .send({
            text: 'testtesttest',
            room: 'testtesttesttest',
            sender: 'testtest'
          })
          .end((err, res) => {
            // check
  
            done();
          })
      });
  
      it('/DELETE messages', done => {
        chai.request(url)
          .delete(path)
          .end((err, res) => {
            // check
  
            done();
          });
      });

    });

  });
  
});