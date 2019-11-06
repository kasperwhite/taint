import { observable, action } from "mobx";

class ObservableContactStore {
  @observable contacts = [
    {id: 0, username: 'Popovich', avatar: require('../assets/cat.jpg')},
    {id: 1, username: 'Yaroslav', avatar: require('../assets/cat.jpg')},
    {id: 2, username: 'Vladimir', avatar: require('../assets/cat.jpg')}
  ];
  @observable isLoading = false;

  constructor(){ }

  @action.bound getContacts() {

  }

  @action.bound postContact(id) {

  }

  @action.bound deleteContact(id) {

  }
}

const contactStore = new ObservableContactStore();
export default contactStore;