const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRouter = express.Router();
const authenticate = require('../authenticate');
const UserModel = require('../models/user');

authRouter.use(bodyParser.json());

authRouter.post('/signup', (req, res, next) => {
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

authRouter.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token});
});

module.exports = authRouter;