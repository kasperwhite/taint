import { observable, action } from "mobx";

import authStore from './AuthStore';
import { sendRequest } from './NetService';

class ObservableContactStore {
  @observable contacts = [];

  @observable contactsIsLoading = false;
  @observable postContactIsLoading = false;
  @observable deleteContactIsLoading = false;

  constructor(){ }

  @action.bound async getContacts() {
    const result = await this.fetchGetContacts();
    if(result.success){ this.contacts = result.res };
    return result;
  }

  @action.bound async postContact(username) {
    const result = await this.fetchPostContact({username});
    if(result.success){ this.contacts = result.res };
    return result;
  }

  @action.bound async deleteContact(id) {
    const result = await this.fetchDeleteContact(id);
    if(result.success){ this.contacts = result.res };
    return result;
  }

  @action
  async fetchGetContacts(){
    this.contactsIsLoading = true;

    const url = 'users/contacts/';
    const method = 'GET';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      this.contactsIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action
  async fetchPostContact(data){
    this.postContactIsLoading = true;

    const url = 'users/contacts/';
    const method = 'POST';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers, data);
      this.postContactIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action
  async fetchDeleteContact(id){
    this.deleteContactIsLoading = true;

    const url = 'users/contacts/' + id;
    const method = 'DELETE';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      this.deleteContactIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }
}

const contactStore = new ObservableContactStore();
export default contactStore;