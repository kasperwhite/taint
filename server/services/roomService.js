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

exports.establishRoomKeys = async (clientIds, io) => {
  try {
    const clients = clientIds.map(cId => (io.sockets.connected[cId]));

    const publicKeys = [];
    let encryptedPublicKeys = [];

    await Promise.all(clients.map(async client => {
      const publicKey = await requestPublicKey(client)
      publicKeys.push({ clientId: client.id, publicKey });
    }));

    /* [ { clientId: '6fQ4foyqOVMYJcIcAAAE', publicKey: '2313123' },
    { clientId: 'ESPlY7RJeTNyzSjJAAAD', publicKey: '2313123' } ] */

    // encryptedPublicKeys = await requestGroupKey(clients[clients.length-1], publicKeys);

    /* [ { clientId: '6fQ4foyqOVMYJcIcAAAE', publicKey: '2313123', encKey: '73487834' },
    { clientId: 'ESPlY7RJeTNyzSjJAAAD', publicKey: '2313123', encKey: '38928934' } ] */

    /* clients.forEach(client => {
      const key = encryptedPublicKeys.find(epc => epc.clientId == clientId).encKey;
      sendGroupKey(client, key);
    }) */

    return {success: true}
  } catch(err) {
    console.log(err);
    return {success: false}
  }
}

const requestPublicKey = (client) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', pk => res(pk));
    client.emit('establish', { type: constants.captureMemberDefault });
  })
}

const requestGroupKey = (client, keys) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', (ek) => { res(ek) })
    client.emit('establish', { type: constants.captureMemberLast, publicKeys: keys })
  })
}

const sendGroupKey = (client, key) => {
  client.emit('publicKey', key)
}