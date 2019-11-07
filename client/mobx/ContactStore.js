import { observable, action } from "mobx";

class ObservableContactStore {
  @observable contacts = [
    {_id: '5dc3c34d4ce0c52834c2a23a', username: 'Popovich', avatar: require('../assets/cat.jpg')},
  ];
  @observable isLoading = false;

  constructor(){ }

  @action.bound async getContacts() {

  }

  @action.bound async postContact(id) {

  }

  @action.bound async deleteContact(id) {

  }
}

const contactStore = new ObservableContactStore();
export default contactStore;