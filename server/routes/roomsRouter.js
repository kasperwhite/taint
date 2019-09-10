const express = require('express');
const bodyParser = require('body-parser');
const RoomModel = require('../models/room');
const roomsRouter = express.Router();

roomsRouter.use(bodyParser.json());

roomsRouter.route('/')
.get((req, res, next) => {
  RoomModel.find({})
  .populate('creator')
  .populate('users')
  .then((rooms) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rooms);
  }, err => next(err))
  .catch(err => next(err))
})
.post((req, res, next) => {
  req.body.users.push(req.body.creator);
  RoomModel.create(req.body)
  .then((room) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(room);
  }, err => next(err))
  .catch(err => next(err))
})
.put((req, res, next) => {
  res.statusCode = 403
  res.end('PUT operation not supported')
})
.delete((req, res, next) => {
  RoomModel.remove({})
  .then((rooms) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rooms);
  }, err => next(err))
  .catch(err => next(err))
})

roomsRouter.route('/:roomId')
.get((req, res, next) => {
  RoomModel.findById(req.params.roomId)
  .then((room) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(room);
  }, err => next(err))
  .catch(err => next(err))
})
.post((req, res, next) => {
  res.statusCode = 403
  res.end('POST operation not supported')
})
.put((req, res, next) => {
  RoomModel.findByIdAndUpdate(req.params.roomId, {$set: req.body}, {new: true})
    .then((room) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(room)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete((req, res, next) => {
  RoomModel.findByIdAndRemove(req.params.roomId)
  .then((room) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(room)
  }, (err) => next(err))
  .catch((err) => next(err))
})

module.exports = roomsRouter;