import { observable, action } from "mobx";

class ObservableRoomMessageStore {
  @observable roomMessages = [];
  @observable messagesIsLoading = false;

  constructor(){ }
  
  @action.bound getRoomMessages(roomId) {

  }

  @action.bound postRoomMessages(roomId, messageData) {

  }
}

const roomMessageStore = new ObservableRoomMessageStore();
export default roomMessageStore;