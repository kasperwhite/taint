import { observable, action } from "mobx";

import authStore from './AuthStore';
import { sendRequest } from './NetService';

class ObservableRoomUserStore {
  @observable roomUsers = [];

  @observable usersIsLoading = false;
  @observable postUserIsLoading = false;
  @observable deleteUserIsLoading = false;

  constructor(){ }
  
  @action.bound async getRoomUsers(roomId) {
    const result = await this.fetchGetUsers(roomId);
    if(result.success){ this.roomUsers = result.res };
    return result;
  }

  @action.bound async postRoomUser(roomId, userId) {

  }

  @action.bound async deleteRoomUser(roomId, userId) {
    const result = await this.fetchDeleteUser(roomId, userId);
    if(result.success){ this.roomUsers = result.res };
    return result;
  }

  @action
  async fetchGetUsers(roomId){
    this.usersIsLoading = true;

    const url = 'rooms/' + roomId + '/users';
    const method = 'GET';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      this.usersIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action
  async fetchDeleteUser(roomId, userId){
    this.deleteUserIsLoading = true;

    const url = 'rooms/' + roomId + '/users/' + userId;
    const method = 'DELETE';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      this.deleteUserIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }
}

const roomUserStore = new ObservableRoomUserStore();
export default roomUserStore;