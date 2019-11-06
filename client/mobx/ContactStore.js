import { observable, action } from "mobx";

class ObservableContactStore {
  @observable contacts = [];
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