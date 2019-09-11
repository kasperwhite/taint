require('mocha')
const chai = require('chai');
const chaiHttp = require('chai-http');
const url = require('../../config').url;

const { expect } = chai;

chai.use(chaiHttp);

module.exports = usersSpecificTest = () => {
  return describe('Specific User', () => {
    let path = '/users/';
    let prevPass = '';

    before((done) => {
      chai.request(url)
        .post('/users')
        .send({
          login: 'TestUser',
          password: '123123'
        })
        .end((err, res) => {
          path = path.concat(res.body._id)

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
    
    it('/GET user', done => {
      chai.request(url)
        .get(path)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.all.keys('_id', 'login', 'password');

          prevPass = res.body.password;

          done();
        });
    });

    it('/PUT user', done => {
      const password = '321312';
      chai.request(url)
        .put(path)
        .send({
          password
        })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.all.keys('_id', 'login', 'password');
          
          expect(res.body.password).to.not.equal(prevPass);
          expect(res.body.password).to.not.equal(password);          

          done();
        })
    });

    it('/DELETE user', done => {
      chai.request(url)
        .delete(path)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.all.keys('_id', 'login', 'password');

          done();
        });
    });
  
})
}