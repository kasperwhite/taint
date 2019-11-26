import { observable, action } from "mobx";

import authStore from './AuthStore';
import { sendRequest } from './NetService';

class ObservableRoomUserStore {
  @observable roomUsers = [];

  @observable usersIsLoading = false;
  @observable postUsersIsLoading = false;
  @observable deleteUserIsLoading = false;

  constructor(){ }
  
  @action.bound async getRoomUsers(roomId) { // todo: socket.io ON roomUsers
    const result = await this.fetchGetUsers(roomId);
    if(result.success){ this.roomUsers = result.res };
    return result;
  }

  @action.bound async postRoomUsers(roomId, users) { // todo: socket.io EMIT addRoomUser
    const result = await this.fetchPostUsers(roomId, {users});
    if(result.success){ this.roomUsers = result.res };
    return result;
  }

  @action.bound async deleteRoomUser(roomId, userId) { // todo: socket.io EMIT deleteRoomUser
    const result = await this.fetchDeleteUser(roomId, userId);
    if(result.success){ this.roomUsers = result.res };
    return result;
  }

  @action async fetchGetUsers(roomId){
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

  @action async fetchDeleteUser(roomId, userId){
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

  @action async fetchPostUsers(roomId, users){
    this.postUsersIsLoading = true;

    const url = 'rooms/' + roomId + '/users/';
    const method = 'POST';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };
    const body = users;

    try {
      let res = await sendRequest(url, method, headers, body);
      this.postUsersIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }  
}

const roomUserStore = new ObservableRoomUserStore();
export default roomUserStore;