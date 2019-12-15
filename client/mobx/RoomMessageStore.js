import { observable, action, computed } from "mobx";

import { sendRequest, socket } from './NetService';
import authStore from './AuthStore';

class ObservableRoomMessageStore {
  @observable roomId = '';
  @observable roomMessages = [];

  @observable messagesIsLoading = false;
  @observable postMessageIsLoading = false;

  @observable messagesIsSuccess = false;
  @observable postMessageIsSuccess = false;

  @observable refresh = false;

  constructor(){ }

  @computed get messages() {
    return this.roomMessages;
  }
  
  @action.bound async getRoomMessages() {
    const result = await this.fetchGetMessages(this.roomId);
    this.messagesIsSuccess = result.success;
    if(result.success){ this.roomMessages = result.res.reverse() }
    return result;
  }

  @action.bound async postRoomMessage(messageData) {
    const roomId = this.roomId;
    const result = await this.fetchPostMessage(roomId, messageData);
    this.postMessageIsSuccess = result.success;
    if(result.success){
      const message = result.res;
      // this.roomMessages.unshift(message);
      socket.emit('messageCreate', {message: JSON.stringify(message), roomId});
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
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action.bound joinRoom({roomDeleteHandler}) {
    socket.emit('roomJoin', this.roomId);

    socket.on('messageCreate', message => {
      this.roomMessages.unshift(JSON.parse(message));
      this.refresh = true;
      this.postMessageIsLoading = false;
    });
    socket.on('roomDeleteForActive', roomId => { roomDeleteHandler('Rooms') });
  }

  @action.bound leaveRoom() {
    socket.removeEventListener('messageCreate');
    socket.removeEventListener('roomDeleteForActive');
    socket.emit('roomLeave', this.roomId);
  }
}

const roomMessageStore = new ObservableRoomMessageStore();
export default roomMessageStore;