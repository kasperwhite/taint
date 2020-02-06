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

exports.establishRoomKeys = async (roomId, clientIds, io) => {
  try {
    const clients = clientIds.map(cId => (io.sockets.connected[cId]));

    // clients public keys request
    let publicKeys = [];
    publicKeys = await requestPublicKeys(clients, roomId, io);

    // request encrypted group key
    const encryptedPublicKeys = await requestGroupKey(clients[clients.length-1], publicKeys);

    // send encrypted group key to clients
    clients.forEach(client => {
      const key = encryptedPublicKeys.find(epk => epk.clientId == client.id).ecryptedGroupKey;
      sendGroupKey(client, key)
    })

    return {success: true}
  } catch(err) {
    console.log(err);
    return {success: false}
  }
}

exports.getGroupKey = async (client, publicKeyPem, roomId) => {
  const groupKey = await requestGroupKeyForUser(client, publicKeyPem, roomId)
  return groupKey;
}

const requestGroupKeyForUser = (client, userPubKey, roomId) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', ek => { res(ek) })
    client.emit('establish', { memberType: constants.shareMember, publicKeyPem: userPubKey, roomId })
  })
}

const requestGroupKey = (client, keys) => {
  return new Promise((res, rej) => {
    client.on('establishResponse', ek => { res(ek) })
    client.emit('establish', { memberType: constants.captureMemberLast, publicKeys: keys })
  })
}

const requestPublicKeys = (clients, roomId, io) => {
  return new Promise((res, rej) => {
    const publicKeys = [];
    
    clients.forEach(client => {
      client.on('establishResponse', pk => {
        publicKeys.push({clientId: client.id, publicKeyPem: pk})
        if(publicKeys.length == clients.length){
          res(publicKeys)
        }
      });
    })
    io.sockets.in(`${roomId}`).emit('establish', { memberType: constants.captureMemberDefault });
  })
}

const sendGroupKey = (client, key) => {
  client.emit('groupKey', key)
}