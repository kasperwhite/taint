process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const { expect } = chai;

chai.use(chaiHttp);

describe('Rooms', () => {
  const path = '/rooms';

  let userId;
  let roomId;
  let messageId;

  it('/GET rooms', done => {
    chai.request(url)
      .get(path)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
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
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'name', 'creator', 'messages', 'keys');
        expect(res.body.users.length).to.be.equal(1);

        roomId = res.body._id;

        done();
      })
  });

  it('/GET rooms/:id', done => {
    const currentPath = path + '/' + roomId;

    chai.request(url)
      .get(currentPath)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'name', 'creator', 'messages', 'keys');
        expect(res.body.users.length).to.be.equal(1);

        done();
      })
  });

  it('/PUT rooms/:id', done => {
    const currentPath = path + '/' + roomId;
    const updatedName = 'UpdatedName';

    chai.request(url)
      .put(currentPath)
      .send({
        name: updatedName
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'name', 'creator', 'messages', 'keys');
        expect(res.body.users.length).to.be.equal(1);
        expect(res.body.name).to.be.equal(updatedName);

        done();
      })
  })

  it('/GET rooms/:id/messages', done => {
    const currentPath = path + '/' + roomId + '/messages';

    chai.request(url)
      .get(currentPath)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(0);

        done();
      })
  });

  it('/POST rooms/:id/messages', done => {
    const currentPath = path + '/' + roomId + '/messages';

    chai.request(url)
      .post(currentPath)
      .send({
        text: 'TestTestTest',
        sender: userId
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(1);

        messageId = res.body[0]._id;

        done();
      })
  });

  it('/GET rooms/:id/messages/:id', done => {
    const currentPath = path + '/' + roomId + '/messages/' + messageId;

    chai.request(url)
      .get(currentPath)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'text', 'sender');

        done();
      })
  });

  it('/PUT rooms/:id/messages/:id', done => {
    const currentPath = path + '/' + roomId + '/messages/' + messageId;
    const updatedText = 'UpdatedTest';

    chai.request(url)
      .put(currentPath)
      .send({
        text: updatedText
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'text', 'sender');
        expect(res.body.text).to.be.equal(updatedText);

        done();
      })
  })

  it('/DELETE rooms/:id/messages/:id', done => {
    const currentPath = path + '/' + roomId + '/messages/' + messageId;

    chai.request(url)
      .delete(currentPath)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'text', 'sender');

        done();
      })
  })

  it('/DELETE rooms/:id/messages', done => {
    const currentPath = path + '/' + roomId + '/messages';

    chai.request(url)
      .delete(currentPath)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(0);

        done();
      })
  });

  it('/DELETE rooms/:id', done => {
    const currentPath = path + '/' + roomId;

    chai.request(url)
      .delete(currentPath)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.all.keys('_id', 'name', 'creator', 'messages', 'keys');
        expect(res.body.users.length).to.be.equal(1);

        done();
      });
  });

  it('/DELETE rooms', done => {
    chai.request(url)
      .delete(path)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.all.keys('n', 'ok', 'deletedCount');

        done();
      });
  });

});