const RoomModel = require('../models/room');
const MessageModel = require('../models/message');

exports.roomDeleteDb = async (roomId) => {
  try {
    const room = await RoomModel.findById(roomId);
    room.messages.forEach(async (mId) => await MessageModel.findByIdAndRemove(mId));
    await RoomModel.findByIdAndRemove(roomId);
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
