#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('server:server');
const server = require('http').createServer(app);
const moment = require('moment');

const fs = require('fs');
const httpsOptions = {
  key: fs.readFileSync(__dirname + '/ssl/taintkey.key', 'utf8'),
  cert: fs.readFileSync(__dirname + '/ssl/taintcert.pem', 'utf8'),
  ca: [
    fs.readFileSync(__dirname + '/ssl/ca_root.pem', 'utf8'),
    fs.readFileSync(__dirname + '/ssl/ca_bundle.pem', 'utf8')
  ]
  
}
const secureServer = require('https').createServer(httpsOptions, app);

const roomDeleteDb = require('../services/roomService').roomDeleteDb;
const getRoomsDb = require('../services/roomService').getRoomsDb;
const unlockRoomDb = require('../services/roomService').unlockRoomDb;
const establishRoomKeys = require('../services/roomService').establishRoomKeys;
const getGroupKey = require('../services/roomService').getGroupKey;

const env = process.env.NODE_ENV;

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
app.set('secPort', port + 443);

/**
 * Listen on provided port, on all network interfaces.
 */

if(env === 'dev'){
  server.listen(app.get('port'), () => {
    console.log('HTTP server listening on port', app.get('port'));
  });
  server.on('error', onError);
  server.on('listening', onListening);
} else {
  secureServer.listen(app.get('secPort'), () => {
    console.log('HTTPS server listening on port', app.get('secPort'));
  });
  secureServer.on('error', onError);
  secureServer.on('listening', onListening);
}

const io = require('socket.io')(env === 'dev' ? server : secureServer);


/**
 * Socket.io listener
 */
const activeUsers = [];
const activeRooms = [];

getRoomsDb().then(rooms => { 
  rooms.forEach(r => activeRooms.push(r));
  console.log('Rooms recieved');
});

let socketRoomDelete;

let plannerIsActivated = false;

io.on('connection', (client) => {

  const planner = async () => {
    plannerIsActivated = true;
  
    setInterval(() => {
      activeRooms.forEach(async room => {
        if(room.type == 'secure'){
          const now = moment(new Date());
          const destroyTime = moment(room.createdAt).add(room.time, 'hours');
    
          if(now.isAfter(destroyTime)) {
            try {
              await roomDeleteDb(room._id);
              socketRoomDelete({roomId: room._id, roomUsers: room.users});
            } catch(err) {
              console.log(err);
            }
          }
        }
      })
    }, 10000)
  }
  if(!plannerIsActivated){ planner() }

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
    activeRooms.push(room);
    try {
      const currentUser = activeUsers.find((u) => u.socketId == client.id);
      const users = room.users.filter((u) => u != currentUser.userId);
      users.forEach((u) => {
        const receiver = activeUsers.find((au) => au.userId == u);
        if(receiver){
          client.to(`${receiver.socketId}`).emit('roomCreate', room);
        }
      })
    } catch(err) {
      console.log(err)
    }
  })

  client.on('roomDelete', ({roomId, roomUsers}) => {
    // this.roomDelete({roomId, roomUsers});
    socketRoomDelete({roomId, roomUsers});
  })

  /* Room events */
  client.on('roomJoin', async roomId => {
    client.join(`${roomId}`);
    if(activeRooms.find(r => r._id == roomId).type == 'secure'){
      establishTry(roomId);
    }
  })

  client.on('roomLeave', roomId => {
    client.leave(`${roomId}`);
    io.in(`${roomId}`).clients(async (err, clients) => {
      io.sockets.in(`${roomId}`).emit('joinedUsers', clients);
    })
  })

  client.on('groupKeyRequest', data => {
    io.in(`${data.roomId}`).clients(async (err, clients) => {
      clients = clients.map(cId => (io.sockets.connected[cId]));
      if(clients.length) {
        const groupKey = await getGroupKey(clients[0], data.publicKeyPem, data.roomId);
        client.emit('sharedGroupKey', {groupKey, success: true});
      } else {
        client.emit('sharedGroupKey', {success: false});
      }
    })
  })

  client.on('messageCreate', ({message, roomId}) => {
    io.sockets.in(`${roomId}`).emit('messageCreate', message);
  })

  client.on('roomDeleteForActive', roomId => {
    io.sockets.in(`${roomId}`).emit('roomDeleteForActive', roomId);
  })

  client.on('roomUserAdd', ({room, users}) => {
    activeRooms.forEach(r => r.users = r._id == room._id ? r.users.concat(users) : r.users)
    users.forEach((u) => {
      const receiver = activeUsers.find((au) => au.userId == u);
      if(receiver){
        client.to(`${receiver.socketId}`).emit('roomCreate', room);
      }
    })
  })

  client.on('roomUserDelete', ({roomId, userId}) => {
    try {
      const receiver = activeUsers.find((au) => au.userId == userId);
      activeRooms.forEach(r => r.users = r._id == roomId ? r.users.filter(u => u != userId) : r.users)
      if(receiver) {
        if(receiver.socketId == client.id) {
          client.emit('roomDelete', roomId);
        } else {
          client.to(`${receiver.socketId}`).emit('roomDelete', roomId);
        }
      }
      establishTry(roomId);
    } catch(err) {
      console.log(err)
    }
  })

  socketRoomDelete = ({roomId, roomUsers}) => {
    try {
      const currentUser = activeUsers.find((u) => u.socketId == client.id);
      if(currentUser) {
        const users = roomUsers.filter((u) => u != currentUser.userId);
        users.forEach((u) => {
          const receiver = activeUsers.find((au) => au.userId == u);
          if(receiver){
            client.to(`${receiver.socketId}`).emit('roomDelete', roomId);
          }
        })
      }
      client.emit('roomDelete', roomId);
      activeRooms.splice(activeRooms.indexOf(activeRooms.find((r) => r._id == roomId)), 1);
    } catch(err) {
      console.log(err)
    }
  }

  unlockRoom = (roomId, clients) => {
    try {
      unlockRoomDb(roomId);
      clients.forEach((c) => { client.to(`${c}`).emit('roomUnlocked', roomId); })
      client.emit('roomUnlocked', roomId);
      activeRooms.forEach(r => { r.locked = r._id == roomId ? false : r.locked })
    } catch(err) {
      console.log(err)
    }
  }

  establishTry = (roomId) => {
    const room = activeRooms.find(r => r._id == roomId);
    let roomUsers = room.users;
    let roomLocked = room.locked;
    io.in(`${roomId}`).clients(async (err, clients) => {
      io.sockets.in(`${roomId}`).emit('joinedUsers', { joinedUsers: clients, allUsers: roomUsers });

      if (roomUsers.length == clients.length && roomLocked) {
        try {
          await establishRoomKeys(roomId, clients, io);
          await unlockRoom(roomId, clients);
        } catch(err) {
          console.log(err);
        }
      }
    });
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
  var addr = env === 'dev' ? server.address() : secureServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
