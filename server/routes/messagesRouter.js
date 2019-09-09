const express = require('express');
const bodyParser = require('body-parser');
const MessageModel = require('../models/message');
const messagesRouter = express.Router();

messagesRouter.use(bodyParser.json());

messagesRouter.route('/')
.get((req, res, next) => {
  MessageModel.find({room: req.body.room})
  .populate('room')
  .populate('sender')
  .then(messages => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(messages);
  }, err => next(err))
  .catch(err => next(err))
})
.post((req, res, next) => {
  MessageModel.create(req.body)
  .then(message => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(message)
  }, err => next(err))
  .catch(err => next(err))
})
.put((req, res, next) => {
  res.statusCode = 403
  res.end('PUT operation not supported')
})
.delete((req, res, next) => {
  MessageModel.remove({room: req.body.room})
  .then((messages) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(messages);
  }, err => next(err))
  .catch(err => next(err))
})

messagesRouter.route('/all')
.get((req, res, next) => {
  MessageModel.find({})
  .then(messages => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(messages);
  }, err => next(err))
  .catch(err => next(err))
})

module.exports = messagesRouter;