import { observable, action } from "mobx";

class ObservableAppStore {
  @observable isLoading = false;
  @observable rooms = [];
  @observable contacts = [];

  constructor(){ }

  @action.bound getRooms() {

  }

  @action.bound postRoom(data) {

  }

  @action.bound getRoom(id) {

  }

  @action.bound deleteRoom(id) {

  }

  @action.bound getRoomMessages(roomId) {

  }

  @action.bound postRoomMessages(roomId, messageData) {

  }

  @action.bound getRoomUsers(roomId) {

  }

  @action.bound postRoomUsers(roomId, userId) {

  }

  @action.bound deleteRoomUser(roomId, userId) {

  }


  @action.bound getContacts() {

  }

  @action.bound postContact(id) {

  }

  @action.bound deleteContact(id) {

  }

}

const appStore = new ObservableAppStore();
export default appStore;