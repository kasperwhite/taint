import { observable, action } from "mobx";

import { sendRequest, socket } from './NetService';
import authStore from './AuthStore';

class ObservableRoomMessageStore {
  @observable roomUsers = [];
  @observable roomMessages = [];

  @observable messagesIsLoading = false;
  @observable postMessageIsLoading = false;

  constructor(){ }
  
  @action.bound async getRoomMessages(roomId) { // todo: socket.io ON roomMessages
    const result = await this.fetchGetMessages(roomId);
    this.roomMessages = result.res.reverse();
  }

  @action.bound async postRoomMessage(roomId, messageData) { // todo: socket.io EMIT sendMessage
    const result = await this.fetchPostMessage(roomId, messageData);
    if(result.success){
      const message = result.res;
      this.roomMessages.unshift(message);
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
}

const roomMessageStore = new ObservableRoomMessageStore();
export default roomMessageStore;