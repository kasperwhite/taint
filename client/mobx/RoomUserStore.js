import { observable, action } from "mobx";

class ObservableRoomUserStore {
  @observable roomUsers = [];
  @observable isLoading = false;

  constructor(){ }
  
  @action.bound getRoomUsers(roomId) {

  }

  @action.bound postRoomUser(roomId, userId) {

  }

  @action.bound deleteRoomUser(roomId, userId) {

  }
}

const roomUserStore = new ObservableRoomUserStore();
export default roomUserStore;