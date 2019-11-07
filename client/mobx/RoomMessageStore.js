import { observable, action } from "mobx";

class ObservableRoomMessageStore {
  @observable roomMessages = [
    { _id: '5dc3c34f4ce0c52834c2a23c',
    text: 'TestTestTest',
    sender: {_id: '5dc3c34d4ce0c52834c2a23a', username: 'kasper'},
    hash: '123',
    createdAt: '2019-11-07T07:10:07.026Z',
    updatedAt: '2019-11-07T07:10:07.026Z' }
  ];
  @observable messagesIsLoading = false;

  constructor(){ }
  
  @action.bound getRoomMessages(roomId) {

  }

  @action.bound postRoomMessages(roomId, messageData) {

  }
}

const roomMessageStore = new ObservableRoomMessageStore();
export default roomMessageStore;