const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const roomsRouter = require('./routes/roomsRouter');
const messagesRouter = require('./routes/messagesRouter');

const app = express();
const config = require('./config');

const env = process.env.NODE_ENV;

// mongoDB connect
const mongoUrl = config.mongoUrl;
const mongoConnect = mongoose.connect(mongoUrl, { useNewUrlParser: true })
mongoConnect.then(() => {
  console.log('Connected correctly to MongoDB Server');
}, (err) => console.log(err));

if(env === 'test'){
  console.log(':::Test server started:::');
} else {
  app.use(logger('dev'));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/rooms', roomsRouter);
app.use('/messages', messagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
