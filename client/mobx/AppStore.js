import { observable, action } from "mobx";

class ObservableAppStore {
  @observable rooms = [];

  constructor(){ }

  @action.bound
  addRoom = (room) => {
    this.rooms.push(room);
  }

}

const appStore = new ObservableAppStore();
export default appStore;