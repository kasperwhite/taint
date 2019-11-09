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
.post((req, res, next) => {
  res.statusCode = 403
  res.end('POST operation not supported')
})
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
/* .get((req, res, next) => {
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
  const avKeys = ['username']; // forsecure
  filterKeys(req.body, avKeys);
  UserModel.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: true})
    .then((user) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err))
}) */
.delete((req, res, next) => { // todo: moved to auth router
  UserModel.findByIdAndRemove(req.params.userId)
  .then((user) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(user)
  }, (err) => next(err))
  .catch((err) => next(err))
})

usersRouter.route('/contacts')
.get(async (req, res, next) => {
  const currentUser = req.user;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(currentUser.contacts);
})
.post(async (req, res, next) => {
  const {username} = req.body;
  const currentUserId = req.user._id;

  const contact = await UserModel.findOne({ username });
  if(contact){
    let user = await UserModel.update({_id: currentUserId}, {$push: {contacts: contact._id}});
    user = await UserModel.findById(currentUserId).populate('contacts');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user.contacts);
  } else {
    err = new Error('User ' + username + ' not found');
    err.status = 404;
    return next(err);
  }
})

usersRouter.route('/contacts/:contactId')
.delete(async (req, res, next) => {
  const {contactId} = req.params;
  const currentUserId = req.user._id;

  let user = await UserModel.update({_id: currentUserId}, {$pullAll: {contacts: [contactId]}})
  user = await UserModel.findById(currentUserId).populate('contacts');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(user.contacts);
})

module.exports = usersRouter;