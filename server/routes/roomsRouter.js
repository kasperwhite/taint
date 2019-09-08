const express = require('express');
const bodyParser = require('body-parser');
const RoomModel = require('../models/room');
const roomsRouter = express.Router();

roomsRouter.use(bodyParser.json());

roomsRouter.route('/')
.get((req, res, next) => {
  RoomModel.find({})
  .then((rooms) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rooms);
  }, err => next(err))
  .catch(err => next(err))
})
.post((req, res, next) => {
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

module.exports = roomsRouter;