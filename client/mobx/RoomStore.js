import { observable, action, computed } from "mobx";

import authStore from './AuthStore';
import messageStore from './RoomMessageStore';
import { sendRequest, socket } from './NetService';

class ObservableRoomStore {
  @observable rooms = [];

  @observable roomsIsLoading = false;
  @observable postRoomIsLoading = false;
  @observable deleteRoomIsLoading = false;
  
  @observable roomsIsSuccess = false;
  @observable postRoomIsSuccess = false;
  @observable deleteRoomIsSuccess = false;

  constructor(){ }

  @computed get roomList() {
    return this.rooms;
  }

  set roomList(rooms) {
    this.rooms = rooms;
  }
  
  @action.bound async getRooms() {
    const result = await this.fetchGetRooms();
    this.roomsIsSuccess = result.success;
    if(result.success){ this.rooms = result.res }
    return result;
  }

  @action.bound async postRoom(data) {
    const result = await this.fetchPostRoom(data);
    this.postRoomIsSuccess = result.success;
    if(result.success){
      const room = result.res;
      this.rooms.unshift(room);
      socket.emit('roomCreate',  room);
    } 
    return result;
  }

  @action.bound async deleteRoom(id) {
    const result = await this.fetchDeleteRoom(id);
    this.deleteRoomIsSuccess = result.success;
    if(result.success){
      const room = result.res;
      socket.emit('roomDelete',  {roomId: id, roomUsers: room.users});
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

  @action.bound openSocketListeners({onRoomDeleteNavigate}) {
    socket.on('roomCreate', room => { this.rooms.unshift(room) });
    socket.on('roomDelete', roomId => {
      const newRooms = this.rooms.filter(r => r._id != roomId);
      this.roomList = newRooms;
      if(messageStore.roomId == roomId) {
        onRoomDeleteNavigate('Rooms');
      }
    });
  }

  @action removeSocketListeners() {
    socket.removeEventListener('roomCreate');
    socket.removeEventListener('roomDelete');
  }

}

const roomStore = new ObservableRoomStore();
export default roomStore;