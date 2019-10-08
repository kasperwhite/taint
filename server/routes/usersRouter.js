const express = require('express');
const bodyParser = require('body-parser');
const UserModel = require('../models/user');
const usersRouter = express.Router();

usersRouter.use(bodyParser.json());

const filterKeys = (object, keys) => {
  Object.keys(object).forEach((key) => {
    if(keys.indexOf(key) == -1) { delete object[key] }
  });
}

usersRouter.route('/')
.get((req, res, next) => {
  UserModel.find({})
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, err => next(err))
  .catch(err => next(err))
})
/* .post((req, res, next) => {
  const { login, password } = req.body;
  if(login && password){
    const hashPassword = crypto.MD5(password);
    UserModel.create({login, password:hashPassword})
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
    }, err => next(err))
    .catch(err => next(err))
  } else {
    res.statusCode = 403;
    res.end('Data is not full');
  }
}) */
.put((req, res, next) => {
  res.statusCode = 403
  res.end('PUT operation not supported')
})
.delete((req, res, next) => {
  UserModel.deleteMany({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, err => next(err))
  .catch(err => next(err))
}) 

usersRouter.route('/:userId')
.get((req, res, next) => {
  UserModel.findById(req.params.userId)
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  }, err => next(err))
  .catch(err => next(err))
})
.post((req, res, next) => {
  res.statusCode = 403
  res.end('POST operation not supported')
})
.put((req, res, next) => {
  const avKeys = ['username'];
  filterKeys(req.body, avKeys);
  UserModel.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: true})
    .then((user) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete((req, res, next) => {
  UserModel.findByIdAndRemove(req.params.userId)
  .then((user) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(user)
  }, (err) => next(err))
  .catch((err) => next(err))
})

module.exports = usersRouter;