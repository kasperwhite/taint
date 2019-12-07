import { observable, action } from "mobx";

import { sendRequest, socket } from './NetService';
import authStore from './AuthStore';

class ObservableRoomMessageStore {
  @observable roomMessages = [];

  @observable messagesIsLoading = false;
  @observable postMessageIsLoading = false;

  constructor(){ }
  
  @action.bound async getRoomMessages(roomId) {
    const result = await this.fetchGetMessages(roomId);
    if(result.success){ this.roomMessages = result.res.reverse() }
    return result;
  }

  @action.bound async postRoomMessage(roomId, messageData) {
    const result = await this.fetchPostMessage(roomId, messageData);
    if(result.success){
      const message = result.res;
      // this.roomMessages.unshift(message);
      socket.emit('messageCreate', {message, roomId});
    }
    return result
  }

  @action async fetchGetMessages(roomId){
    this.messagesIsLoading = true;

    const url = 'rooms/' + roomId + '/messages';
    const method = 'GET';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      this.messagesIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action async fetchPostMessage(roomId, data){
    this.postMessageIsLoading = true;

    const url = 'rooms/' + roomId + '/messages';
    const method = 'POST';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers, data);
      this.postMessageIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action joinRoom({roomId, roomDeleteHandler}) {
    socket.emit('roomJoin', roomId);

    socket.on('messageCreate', message => { this.roomMessages.unshift(message) });
    socket.on('roomDeleteForActive', roomId => { roomDeleteHandler('Rooms') });
  }

  @action leaveRoom(roomId) {
    socket.removeEventListener('messageCreate');
    socket.removeEventListener('roomDeleteForActive');
    socket.emit('roomLeave', roomId);
  }
}

const roomMessageStore = new ObservableRoomMessageStore();
export default roomMessageStore;