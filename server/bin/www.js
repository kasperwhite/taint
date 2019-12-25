#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('server:server');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const https = require('https');
const fs = require('fs');

const moment = require('moment');

const roomDeleteDb = require('../services/roomService').roomDeleteDb;
const getRoomsDb = require('../services/roomService').getRoomsDb;

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
app.set('secPort', port + 443);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log('Server listening on port', app.get('port'));
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Socket.io listener
 */
const activeUsers = [];

const activeRooms = [];
let plannerId;

io.on('connection', async (client) => {
  if(!plannerId){
    const rooms = await getRoomsDb();
    rooms.forEach(r => activeRooms.push(r));

    plannerId = setInterval(() => {
      activeRooms.forEach(room => {
        const now = moment(new Date());
        const destroyTime = moment(room.createdAt).add(room.time, 'ms');

        if(now.isAfter(destroyTime)) {
          try {
            roomDeleteDb(room._id);
            this.roomDelete({roomId: room._id, roomUsers: room.users});

            activeRooms.splice(activeRooms.indexOf(activeRooms.find((r) => r._id == room._id)), 1);
          } catch(err) {
            console.log(err);
          }
        }

      })
    }, 5000)
  }

  /* Activity events */
  client.on('online', userId => {
    if(activeUsers.find((u) => u.userId == userId)){
      activeUsers.forEach((u) => {
        u.socketId = u.userId == userId ? client.id : u.socketId
      })
      console.log('Client reconnected: ', activeUsers);
    } else {
      activeUsers.push({ socketId: client.id, userId });
      console.log('Client connected: ', activeUsers);
    }
  })

  client.on('offline', userId => {
    activeUsers.splice(activeUsers.indexOf(activeUsers.find((u) => u.userId == userId && u.socketId == client.id)), 1);
    console.log('Client offline: ', activeUsers);
  })

  client.on('disconnect', (reason) => { // offline
    if(reason == 'io server disconnect' || reason == 'io client disconnect' || reason == 'ping timeout'){

    } else {
      activeUsers.splice(activeUsers.indexOf(activeUsers.find((u) => u.socketId == client.id)), 1);
      console.log('Client disconnected: ', reason, activeUsers);
    }
  })

  /* Room List events */
  client.on('roomCreate', room => {
    const currentUser = activeUsers.find((u) => u.socketId == client.id);
    const users = room.users.filter((u) => u != currentUser.userId);
    users.forEach((u) => {
      const receiver = activeUsers.find((au) => au.userId == u);
      if(receiver){
        client.to(`${receiver.socketId}`).emit('roomCreate', room);
      }
    })
    activeRooms.push(room);
  })

  client.on('roomDelete', ({roomId, roomUsers}) => {
    this.roomDelete({roomId, roomUsers});
  })

  /* Room events */
  client.on('roomJoin', roomId => {
    client.join(`${roomId}`);
  })

  client.on('roomLeave', roomId => {
    client.leave(`${roomId}`);
  })

  client.on('messageCreate', ({message, roomId}) => {
    io.sockets.in(`${roomId}`).emit('messageCreate', message);
  })

  client.on('roomDeleteForActive', roomId => {
    io.sockets.in(`${roomId}`).emit('roomDeleteForActive', roomId);
  })

  client.on('roomUserAdd', ({room, users}) => {
    users.forEach((u) => {
      const receiver = activeUsers.find((au) => au.userId == u);
      if(receiver){
        client.to(`${receiver.socketId}`).emit('roomCreate', room);
      }
    })
  })

  client.on('roomUserDelete', ({roomId, userId}) => {
    const receiver = activeUsers.find((au) => au.userId == userId);
    if(receiver) {
      if(receiver.socketId == client.id) {
        client.emit('roomDelete', roomId);
      } else {
        client.to(`${receiver.socketId}`).emit('roomDelete', roomId);
      }
    }
  })

  this.roomDelete = ({roomId, roomUsers}) => {
    const currentUser = activeUsers.find((u) => u.socketId == client.id);
    const users = roomUsers.filter((u) => u != currentUser.userId);
    users.forEach((u) => {
      const receiver = activeUsers.find((au) => au.userId == u);
      if(receiver){
        client.to(`${receiver.socketId}`).emit('roomDelete', roomId);
      }
    })
    client.emit('roomDelete', roomId);
    activeRooms.splice(activeRooms.indexOf(activeRooms.find((r) => r._id == roomId)), 1);
  }

});

/* var credentials = {
  key: fs.readFileSync(__dirname + '/ssl/private.key'),
  cert: fs.readFileSync(__dirname + '/ssl/certificate.pem')
}

var secureServer = https.createServer(credentials, app);
secureServer.listen(app.get('secPort'), () => {
  console.log('Server listening on port', app.get('secPort'))
});
secureServer.on('error', onError);
secureServer.on('listening', onListening); */

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
