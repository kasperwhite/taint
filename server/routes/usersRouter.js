const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const UserModel = require('../models/user');
const usersRouter = express.Router();
const authenticate = require('../authenticate');

usersRouter.use(bodyParser.json());

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
})
.put((req, res, next) => {
  res.statusCode = 403
  res.end('PUT operation not supported')
}) */
.delete((req, res, next) => {
  UserModel.deleteMany({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, err => next(err))
  .catch(err => next(err))
}) 

/* usersRouter.route('/:userId')
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
  if(req.body.password){
    req.body.password = crypto.MD5(req.body.password);
  }
  UserModel.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: true})
    .then((user) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user)
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
}) */

usersRouter.post('/signup', (req, res, next) => {
  UserModel.register(new UserModel({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true});
      });
    }
  });
});

usersRouter.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token});
});

module.exports = usersRouter;