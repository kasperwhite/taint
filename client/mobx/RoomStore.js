import { observable, action, computed } from "mobx";

import authStore from './AuthStore';
import messageStore from './RoomMessageStore';
import { sendRequest, socket } from './NetService';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import { AsyncStorage } from "react-native";

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
      await this.presentLocalNotification(room.name)
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
  }

  @action removeSocketListeners() {
    socket.removeEventListener('roomCreate');
    socket.removeEventListener('roomDelete');
    socket.removeEventListener('roomUnlocked')
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

  @action async presentLocalNotification(roomName){
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: 'New room',
      body: 'Please check new room ' + roomName + ' for the group key establishment',
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true,
        color: '#09C709'
      }
    })
  }

  @action async deleteRoomKey(roomId) {
    await AsyncStorage.removeItem(`room/${roomId}/groupKey`);
  }

}

const roomStore = new ObservableRoomStore();
export default roomStore;