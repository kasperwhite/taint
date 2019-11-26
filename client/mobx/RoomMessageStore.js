import { observable, action } from "mobx";

import { sendRequest } from './NetService';
import authStore from './AuthStore';

class ObservableRoomMessageStore {
  @observable roomMessages = [];

  @observable messagesIsLoading = false;
  @observable postMessageIsLoading = false;

  constructor(){ }
  
  @action.bound async getRoomMessages(roomId) { // todo: socket.io ON roomMessages
    const messages = await this.fetchGetMessages(roomId);
    this.roomMessages = messages.reverse();
  }

  @action.bound async postRoomMessage(roomId, messageData) { // todo: socket.io EMIT sendMessage
    const messages = await this.fetchPostMessage(roomId, messageData);
    this.roomMessages = messages.reverse(); 
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