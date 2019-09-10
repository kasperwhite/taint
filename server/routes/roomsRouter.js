const express = require('express');
const bodyParser = require('body-parser');
const RoomModel = require('../models/room');
const MessageModel = require('../models/message');
const roomsRouter = express.Router();

roomsRouter.use(bodyParser.json());

roomsRouter.route('/')
.get((req, res, next) => {
  RoomModel.find({})
  .populate('creator')
  .populate('users')
  .populate('messages.sender')
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
  res.statusCode = 403;
  res.end('PUT operation not supported');
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
  .populate('creator')
  .populate('users')
  .populate('messages.sender')
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

roomsRouter.route('/:roomId/messages')
.get((req, res, next) => {
  RoomModel.findById(req.params.roomId)
  .populate('messages.sender')
  .then((room) => {
    if(room){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(room.messages);
    } else {
      err = new Error('Room ' + req.params.roomId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, err => next(err))
  .catch(err => next(err))
})

.post((req, res, next) => {
  RoomModel.findById(req.params.roomId)
  .then(room => {
    if(room){
      room.messages.push(req.body)
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
    } else {
      err = new Error('Room ' + req.params.roomId + ' not found')
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

.delete((req, res, next) => {
  RoomModel.findById(req.params.roomId)
  .then(room => {
    if(room){
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
    } else {
      err = new Error('Room ' + req.params.roomId + ' not found')
      err.status = 404
      return next(err)
    }
  }, err => next(err))
  .catch(err => next(err))
})

roomsRouter.route('/:roomId/messages/:messageId')
.get((req, res, next) => {
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

.put((req, res, next) => { //todo: check rigths
  const {roomId, messageId} = req.params;
  const {text} = req.body;

  RoomModel.findById(roomId)
  .then((room) => {
    const message = room.messages.id(messageId);
    if(room && message){
      message.text = text;
      room.save()
      .then((room) => {
        RoomModel.findById(room._id)
        .then((room) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(message)
        })
      })
      .catch(err => next(err))
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

.delete((req, res, next) => { //todo: check rigths
  const {roomId, messageId} = req.params;

  RoomModel.findById(roomId)
  .then((room) => {
    const message = room.messages.id(messageId);
    if(room && message){
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

module.exports = roomsRouter;