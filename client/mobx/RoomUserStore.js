import { observable, action } from "mobx";

class ObservableRoomUserStore {
  @observable roomUsers = [];
  @observable isLoading = false;

  constructor(){ }
  
  @action.bound async getRoomUsers(roomId) {
    
  }

  @action.bound async postRoomUser(roomId, userId) {

  }

  @action.bound async deleteRoomUser(roomId, userId) {

  }
}

const roomUserStore = new ObservableRoomUserStore();
export default roomUserStore;