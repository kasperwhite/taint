const RoomModel = require('../models/room');
const MessageModel = require('../models/message');
const constants = require('./constants');

exports.roomDeleteDb = async (roomId) => {
  try {
    const room = await RoomModel.findById(roomId);
    if (room) {
      room.messages.forEach(async (mId) => await MessageModel.findByIdAndRemove(mId));
      await RoomModel.findByIdAndRemove(roomId);
    }
  } catch(err) {
    console.log(err);
  }
}

exports.getRoomsDb = async () => {
  try {
    const rooms = await RoomModel.find({});
    return rooms;
  } catch(err) {
    console.log(err);
    return [];
  }
}

exports.unlockRoomDb = async (roomId) => {
  try {
    let room = await RoomModel.findById(roomId);
    if (room) {
      room.locked = false;
      room = await room.save();
    }
  } catch(err) {
    console.log(err)
  }
}

exports.establishRoomKeys = (clients) => {
  try {
    let q = "";

    clients.forEach(async (client, i) => {
      if(i == 0) {
        q = await qEmitFirst(client);
      } else if(i == clients.length) {
        await qEmitLast(client, q);

        let eq = "";
        [...clients].reverse().forEach(async (eqClient, eqI) => {
          if(eqI == 0) {
            eq = await eqEmitFirst(eqClient);
          } else if(eqI == clients.length) {
            await eqEmitLast(eqClient)
          } else {
            eq = await eqEmitInter(eqClient, eq)
          }
        })
      } else {
        q = await qEmitInter(client, q);
      }
    })

    return {success: true}
  } catch(err) {
    console.log(err);
    return {success: false}
  }
}

const qEmitFirst = (client) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', (q) => { res(q) })
    client.emit('establish', { type: constants.qFirst })
  })
}

const qEmitInter = (client, prevQ) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', (q) => { res(q) })
    client.emit('establish', { type: constants.qInter, prevQ })
  })
}

const qEmitLast = (client, prevQ) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', () => { res() })
    client.emit('establish', { type: constants.qLast, prevQ })
  })
}

const eqEmitFirst = (client) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', (eq) => { res(eq) })
    client.emit('establish', { type: constants.eqFirst })
  })
}

const eqEmitInter = (client, prevEq) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', (eq) => { res(eq) })
    client.emit('establish', { type: constants.eqInter, prevEq })
  })
}

const eqEmitLast = (client, prevEq) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', () => { res() })
    client.emit('establish', { type: constants.eqLast, prevEq })
  })
}