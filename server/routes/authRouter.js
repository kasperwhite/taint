const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRouter = express.Router();
const authenticate = require('../authenticate');

const UserModel = require('../models/user');
const RoomModel = require('../models/room');
const MessageModel = require('../models/message');

authRouter.use(bodyParser.json());

authRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if(username.length <= 20 && username.length > 3 && password.length >= 12){
    let avatarId = Math.floor(Math.random() * 2);
    const visible = true;
    UserModel.register(new UserModel({username: username, avatarId, visible}),
      password, (err, user) => {
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
  } else {
    err = new Error('Username validation error')
    err.status = 409;
    return next(err);
  }
});

authRouter.post('/signin', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token});
});

authRouter.post('/change_password', async (req, res, next) => {
  const { oldPass, newPass, userId } = req.body;
  const user = await UserModel.findById(userId);
  user.changePassword(oldPass, newPass, (err, user) =>{
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true});
    }
  })
})

authRouter.post('/change_username', async (req, res, next) => {
  const { newUsername, userId } = req.body;

  try {
    let user = await UserModel.findById(userId);
    user.username = newUsername;
    user = await user.save();
    user = await UserModel.findById(userId);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  } catch(err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({error: err});
  }
})

authRouter.post('/change_visible', async (req, res, next) => {
  const { value, userId } = req.body;

  try {
    let user = await UserModel.findById(userId);
    user.visible = value;
    user = await user.save();
    user = await UserModel.findById(userId);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(user);
  } catch(err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({error: err});
  }
})

authRouter.delete('/account', async (req, res, next) => {
  const { password, userId } = req.body;

  const user = await UserModel.findById(userId);

  user.authenticate(password, async (err, user) => {
    if(user){
      try {
        await UserModel.findByIdAndRemove(userId);
        await RoomModel.remove({ creator: userId });
        await MessageModel.remove({ sender: userId });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true});
      } catch(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false});
      }
    } else {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false});
    }
  })
})

module.exports = authRouter;