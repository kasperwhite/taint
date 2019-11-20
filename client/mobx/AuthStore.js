import { observable, action } from "mobx";
import { AsyncStorage } from "react-native";

import { serverUrl } from './config';
import { sendRequest } from './NetService';

class ObservableAuthStore {
  @observable signUpIsLoading = false;
  @observable signInIsLoading = false;

  @observable userId = '';
  @observable userToken = '';

  constructor(){ }

  @action.bound
  async signIn({username, password}) {
    const result = await this.fetchSignIn({username, password});
    return result;
  }

  @action.bound 
  async signUp({username, password}) {
    const result = await this.fetchSignUp({username, password});
    return result;
  }

  @action.bound
  async signOut() {
    await AsyncStorage.removeItem('userToken');
  }

  @action.bound async deleteAccount() {

  }

  @action
  async fetchSignUp(data){
    this.signUpIsLoading = true;

    const url = 'auth/signup';
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };

    try {
      let res = await sendRequest(url, method, headers, data);
      this.signUpIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action
  async fetchSignIn(data){
    this.signInIsLoading = true;

    const url = 'auth/signin';
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };

    try {
      let res = await sendRequest(url, method, headers, data);
      this.signInIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

}

const authStore = new ObservableAuthStore();
export default authStore;