import { observable, action } from "mobx";

class ObservableRoomStore {
  @observable rooms = [];
  @observable isLoading = false;

  constructor(){ }
  
  @action.bound getRooms() {

  }

  @action.bound postRoom(data) {
    this.rooms.push(data);

    return data.id;
  }

  @action.bound getRoom(id) {

  }

  @action.bound deleteRoom(id) {

  }
}

const roomStore = new ObservableRoomStore();
export default roomStore;