import { observable, action, computed, toJS } from "mobx";

import authStore from './AuthStore';
import { sendRequest, socket } from './NetService';

class ObservableRoomUserStore {
  @observable roomUsers = [];

  @observable usersIsLoading = false;
  @observable postUsersIsLoading = false;
  @observable deleteUserIsLoading = false;

  @observable usersIsSuccess = false;
  @observable postUsersSuccess = false;
  @observable deleteUserSuccess = false;

  constructor(){ }

  @computed get users() {
    return this.roomUsers;
  }
  
  @action.bound async getRoomUsers(roomId) {
    const result = await this.fetchGetUsers(roomId);
    this.usersIsSuccess = result.success;
    if(result.success){
      this.roomUsers = this.sort(result.res);
    };
    return result;
  }

  @action.bound async postRoomUsers(room, users) {
    const result = await this.fetchPostUsers(room._id, { users });
    this.postUsersSuccess = result.success;
    if(result.success){
      this.roomUsers = this.sort(result.res);
      socket.emit('roomUserAdd', { room, users: users.map(u => u._id), usernames: users.map(u => u.username), execName: authStore.user.username });
      socket.emit('roomUpdate', room._id);
    };
    return result;
  }

  @action.bound async deleteRoomUser(roomId, userId, userName) {
    const result = await this.fetchDeleteUser(roomId, userId);
    this.deleteUserSuccess = result.success;
    if(result.success){
      this.roomUsers = this.sort(result.res);
      socket.emit('roomUserDelete', {roomId, userId, userName, execName: authStore.user.username});
      socket.emit('roomUpdate', roomId);
    };
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
  
  @action sort(list) {
    return list.sort((a, b) => a.username.localeCompare(b.username));
  }
}

const roomUserStore = new ObservableRoomUserStore();
export default roomUserStore;