import { observable, action } from "mobx";

class ObservableRoomUserStore {
  @observable roomUsers = [
    {_id: '5dc3c34d4ce0c52834c2a23a', username: 'Popovich', avatar: require('../assets/cat.jpg')},
  ];
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