import { observable, action, computed, toJS } from "mobx";

import authStore from './AuthStore';
import messageStore from './RoomMessageStore';
import { sendRequest, socket } from './NetService';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import { AsyncStorage } from "react-native";
import roomMessageStore from "./RoomMessageStore";

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
    if(result.success){
      this.rooms = result.res;
      this.rooms.forEach(r => {
        if(r.newForUsers.includes(authStore.user._id)){
          r.hasNewMessage = true;
        }
      })
      this.rooms = this.rooms.slice().sort((a,b) => { return new Date(a.lastUpdate) - new Date(b.lastUpdate) })
    }
    return result;
  }

  @action.bound async postRoom(data) {
    const result = await this.fetchPostRoom(data);
    this.postRoomIsSuccess = result.success;
    if(result.success){
      const room = result.res;
      this.rooms.push(room);
      socket.emit('roomCreate', room);
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
    socket.on('roomCreate', async room => {
      this.rooms.push(room);
      await this.presentLocalNotification(room.name, room.type)
    });
    socket.on('roomDelete', async roomId => {
      const newRooms = this.roomList.filter(r => r._id != roomId);
      this.roomList = newRooms;
      if(messageStore.roomId == roomId) {
        onRoomDeleteNavigate('Rooms');
      }
      await this.deleteRoomKey(roomId);
    });
    socket.on('roomUnlocked', roomId => {
      const rooms  = this.roomList;
      rooms.forEach(r => r.locked = r._id == roomId ? false : r.locked );
      if(messageStore.roomId == roomId) {
        messageStore.getRoomMessages();
      }
      this.roomList = rooms;
    })
    socket.on('roomUpdate', roomId => {
      // this.pushRoomToTop(roomId);
      const rooms = toJS(this.rooms);
      rooms.find(r => r._id == roomId).hasNewMessage = true;
      this.rooms = rooms;
    })
  }

  @action removeSocketListeners() {
    socket.removeEventListener('roomCreate');
    socket.removeEventListener('roomDelete');
    socket.removeEventListener('roomUnlocked');
    socket.removeEventListener('newMessage');
  }

  @action async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
    if(permission.status !== 'granted'){
      permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
      if(permission.status !== 'granted'){
        Alert.alert('Permission not granted to show notifications');
      }
    }
    return permission;
  }

  @action async presentLocalNotification(roomName, roomType){
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: 'New room',
      body: `You were invited to the room ${roomName}. ${roomType == 'secure' ? 'You should join for group key establishment.' : ''}`,
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true,
        color: '#09C709',
        icon: '../assets/icon.png'
      }
    })
  }

  @action async deleteRoomKey(roomId) {
    await AsyncStorage.removeItem(`room/${roomId}/groupKey`);
  }

  @action pushRoomToTop(roomId) {
    let room = this.rooms.find(r => r._id == roomId);
    if(room){
      room = JSON.parse(JSON.stringify(room));
      this.rooms.splice(this.rooms.indexOf(room), 1);
      this.rooms.push(room)
    }
  }

}

const roomStore = new ObservableRoomStore();
export default roomStore;