import { observable, action } from "mobx";

class ObservableRoomStore {
  @observable rooms = [
    {
      _id: '5dc3c37d4ce0c52834c2a24a',
      name: 'Test',
      users: ['5dc3c34d4ce0c52834c2a23a', '5dc3c35d4ce0c52834c2a23a'],
      key: '123',
      time: 1231,
      messages: [0, 1]
    }
  ];
  @observable isLoading = false;

  constructor(){ }
  
  @action.bound getRooms() {

  }

  @action.bound postRoom(data) {
    data._id = this.rooms.length;
    data.messages = [];
    this.rooms.push(data);

    return data.id;
  }

  @action.bound getRoom(id) {
    return this.rooms.find(r => r._id == id);
  }

  @action.bound deleteRoom(id) {

  }
}

const roomStore = new ObservableRoomStore();
export default roomStore;