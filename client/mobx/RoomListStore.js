import { observable, action } from "mobx";

class RoomListStore {
  @observable rooms = [];

  constructor(){ }

  @action.bound
  addRoom = (room) => {
    this.rooms.push(room);
  }

}

const roomListStore = new RoomListStore();
export default roomListStore;