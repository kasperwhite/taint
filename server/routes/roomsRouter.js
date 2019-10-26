const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto-js');
const RoomModel = require('../models/room');
const roomsRouter = express.Router();

roomsRouter.use(bodyParser.json());

roomsRouter.route('/')
.get((req, res, next) => { // NOT ALLOW
  RoomModel.find({})
  .then((rooms) => {
    const userRooms = rooms.filter((r) => r.users.includes(req.user._id));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(userRooms);
  }, err => next(err))
  .catch(err => next(err))
})

.post(async (req, res, next) => { // ALLOW: add room
  /* const roomTypes = ['private', 'public'];
  if(roomTypes.includes(String(req.body.type))){ */
    req.body.creator = req.user._id;
    req.body.users.push(req.user._id);
    /* if(req.body.type === 'private'){
      const key = await KeyModel.create({ key: req.body.publicKey, owner: req.user._id });
      req.body.publicKeys = [key._id];
    } */
    const room = await RoomModel.create(req.body)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(room);
  /* } else {
    err = new Error('Unknown room type');
    err.status = 400;
    return next(err);
  } */
})

.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported');
})

.delete((req, res, next) => { // NOT ALLOW
  RoomModel.deleteMany({})
  .then((rooms) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(rooms);
  }, err => next(err))
  .catch(err => next(err))
})

roomsRouter.route('/:roomId')
.get((req, res, next) => { // ALLOW: get room
  RoomModel.findById(req.params.roomId)
  .populate('messages')
  .then((room) => {
    if(room.users.includes(req.user._id)){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(room);
    } else {
      err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }
  }, err => next(err))
  .catch(err => next(err))
})

.post((req, res, next) => {
  res.statusCode = 403
  res.end('POST operation not supported')
})

.put((req, res, next) => { // ALLOW: update room
  RoomModel.findById(req.params.roomId)
  .then((room) => {
    if(String(room.creator) === String(req.user._id)){

      RoomModel.findByIdAndUpdate(req.params.roomId, {$set: req.body}, {new: true})
      .then((room) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(room)
      }, (err) => next(err))
      .catch((err) => next(err))

    } else {
      err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }
  }, err => next(err))
  .catch(err => next(err))
})

.delete((req, res, next) => { // ALLOW: delete room
  RoomModel.findById(req.params.roomId)
  .then((room) => {
    if(String(room.creator) === String(req.user._id)){

      RoomModel.findByIdAndRemove(req.params.roomId)
      .then((room) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(room)
      }, (err) => next(err))
      .catch((err) => next(err))

    } else {
      err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }
  }, err => next(err))
  .catch(err => next(err))
})
 
roomsRouter.route('/:roomId/messages')
/* .get((req, res, next) => {
  const {roomId} = req.params;
  RoomModel.findById(roomId)
  .populate('messages.sender')
  .then((room) => {
    if(room){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(room.messages);
    } else {
      err = new Error('Room ' + roomId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, err => next(err))
  .catch(err => next(err))
}) */

.post((req, res, next) => { // ALLOW: add message
  const {roomId} = req.params;
  RoomModel.findById(roomId)
  .then(room => {
    if(room && room.users.includes(req.user._id)){
      req.body.sender = req.user._id;
      room.messages.push(req.body);
      room.save()
      .then((room) => {
        RoomModel.findById(room._id)
        .then((room) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(room.messages)
        })
        .catch(err => next(err))
      })
    } else if(!room.users.includes(req.user._id)){
      err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    } else {
      err = new Error('Room ' + roomId + ' not found')
      err.status = 404
      return next(err)
    }
  }, err => next(err))
  .catch(err => next(err))
})

.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported');
})

.delete((req, res, next) => { // NOT ALLOW
  const {roomId} = req.params;
  RoomModel.findById(roomId)
  .then(room => {
    if(room && String(room.creator) === String(req.user._id)){
      room.messages = []
      room.save()
      .then((room) => {
        RoomModel.findById(room._id)
        .then((room) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(room.messages)
        })
      })
      .catch(err => next(err))
    } else if(room.creator !== req.user._id){
      err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    } else {
      err = new Error('Room ' + roomId + ' not found')
      err.status = 404
      return next(err)
    }
  }, err => next(err))
  .catch(err => next(err))
})

roomsRouter.route('/:roomId/messages/:messageId')
.get((req, res, next) => { // NOT ALLOW
  const {roomId, messageId} = req.params;
  
  RoomModel.findById(roomId)
  .populate('messages.sender')
  .then((room) => {
    const message = room.messages.id(messageId);
    if(room && message){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(message);
    } else if(!room) {
      err = new Error('Room ' + roomId + ' not found')
      err.status = 404
      return next(err)
    } else {
      err = new Error('Message ' + messageId + ' not found')
      err.status = 404
      return next(err)
    }
  }, err => next(err))
  .catch(err => next(err))
})

.post((req, res, next) => {
  res.statusCode = 403
  res.end('POST operation not supported')
})

.put((req, res, next) => { // ALLOW: update message
  const {roomId, messageId} = req.params;
  const {text} = req.body;
  RoomModel.findById(roomId)
  .then((room) => {
    const message = room.messages.id(messageId);
    if(room && message && String(message.sender) === String(req.user._id)){
      message.text = text;
      room.save()
      .then((room) => {
        RoomModel.findById(room._id)
        .populate('messages.sender')
        .then((room) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(room.messages.find((m) => String(m._id) === String(messageId)))
        })
      })
      .catch(err => next(err))
    } else if(message.sender !== req.user._id){
      err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    } else if(!room) {
      err = new Error('Room ' + roomId + ' not found')
      err.status = 404
      return next(err)
    } else {
      err = new Error('Message ' + messageId + ' not found')
      err.status = 404
      return next(err)
    }
  }, err => next(err))
  .catch(err => next(err))
})

.delete((req, res, next) => { // ALLOW: delete message
  const {roomId, messageId} = req.params;

  RoomModel.findById(roomId)
  .then((room) => {
    const message = room.messages.id(messageId);
    if(room && message && String(message.sender) === String(req.user._id)){
      message.remove()
      room.save()
      .then((room) => {
        RoomModel.findById(room._id)
        .then((room) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(message);
        })
      })
    } else if(message.sender !== req.user._id){
      err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    } else if(!room) {
      err = new Error('Room ' + roomId + ' not found')
      err.status = 404
      return next(err)
    } else {
      err = new Error('Message ' + messageId + ' not found')
      err.status = 404
      return next(err)
    }
  }, err => next(err))
  .catch(err => next(err))
})

roomsRouter.route('/:roomId/users')
.post(async (req, res, next) => { // ALLOW: add user in chat
  const {roomId} = req.params;

  let room = await RoomModel.update({_id: roomId}, {$push: {users: req.body.userId}});
  room = await RoomModel.findById(roomId);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(room.users);
})

roomsRouter.route('/:roomId/users/:userId')
.delete(async (req, res, next) => { // ALLOW: remove user from chat
  const {roomId, userId} = req.params;

  let room = await RoomModel.update({_id: roomId}, {$pullAll: {users: [userId]}})
  room = await RoomModel.findById(roomId);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(room.users);
})

module.exports = roomsRouter;