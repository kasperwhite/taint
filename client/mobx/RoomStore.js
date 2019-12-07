import { observable, action } from "mobx";

import authStore from './AuthStore';
import { sendRequest, socket } from './NetService';

class ObservableRoomStore {
  @observable rooms = [];

  @observable roomsIsLoading = false;
  @observable postRoomIsLoading = false;
  @observable deleteRoomIsLoading = false;

  constructor(){ }
  
  @action.bound async getRooms() { // todo: socket.io ON rooms
    const result = await this.fetchGetRooms();
    if(result.success){
      this.rooms = result.res;
    }
    return result;
  }

  @action.bound async postRoom(data) { // todo: socket.io EMIT addRoom
    const result = await this.fetchPostRoom(data);
    if(result.success){
      const room = result.res;
      this.rooms.unshift(room);
      socket.emit('roomCreate',  room);
    } 
    return result;
  }

  @action.bound async deleteRoom(id) { // todo: socket.io EMIT deleteRoom
    const result = await this.fetchDeleteRoom(id);
    if(result.success){
      const room = result.res;
      this.rooms = this.rooms.filter(r => r._id !== room._id);
      socket.emit('roomDelete',  room);
      socket.emit('roomDeleteForActive', room._id);
    }
    return result;
  }

  @action async fetchGetRooms(){
    this.roomsIsLoading = true;

    const url = 'rooms/';
    const method = 'GET';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      this.roomsIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action async fetchPostRoom(data){
    this.postRoomIsLoading = true;

    const url = 'rooms/';
    const method = 'POST';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers, data);
      this.postRoomIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action async fetchDeleteRoom(id){
    this.deleteRoomIsLoading = true;

    const url = 'rooms/' + id;
    const method = 'DELETE';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      this.postRoomIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action getRoom(id) {
    return this.rooms.find(r => r._id == id);
  }

  @action openSocketListeners() {
    socket.on('roomCreate', room => {
      this.rooms.unshift(room);
    });
    socket.on('roomDelete', room => {
      this.rooms = this.rooms.filter(r => r._id !== room._id); 
    });
  }

  @action removeSocketListeners() {
    socket.removeEventListener('roomCreate');
    socket.removeEventListener('roomDelete');
  }

}

const roomStore = new ObservableRoomStore();
export default roomStore;