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
    let userId = '';

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

    describe('Rooms', () => {
      const roomsPath = '/rooms';
      let roomId = '';

      it('/GET rooms', done => {
        chai.request(url)
          .get(roomsPath)
          .end((err, res) => {
            // check

            done();
          });
      });

      it('/POST rooms', done => {
        chai.request(url)
          .post(roomsPath)
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

      describe('Room Messages', () => {
        const messagesPath = `${roomsPath}/${roomId}/messages`
        
        it('/GET messages', done => {
          chai.request(url)
            .get(messagesPath)
            .end((err, res) => {
              // check
    
              done()
            });
        });

        it('/POST messages', done => {
          chai.request(url)
            .post(messagesPath)
            .send({
              text: 'testtesttest',
              sender: userId
            })
            .end((err, res) => {
              // check
    
              done();
            })
        });
    
        it('/DELETE messages', done => {
          chai.request(url)
            .delete(messagesPath)
            .end((err, res) => {
              // check
    
              done();
            });
        });

        });

      it('/DELETE rooms', done => {
        chai.request(url)
          .delete(roomsPath)
          .end((err, res) => {
            // check

            done();
          });
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
  //
});