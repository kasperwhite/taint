import { observable, action } from "mobx";
import { AsyncStorage } from "react-native";
import { serverUrl } from './config';

class ObservableAuthStore {
  @observable signUpIsLoading = true;
  @observable signInIsLoading = false;

  @observable userId = '';
  @observable userToken = '';

  constructor(){ }

  @action.bound
  async signIn({username, password}) {
    console.log(username, password);

    await AsyncStorage.setItem('userToken', '1234-5678');
  }

  @action.bound 
  signUp({username, password}) {
    this.fetchSignUp({username, password})
    .then(r => console.log(r))
    .catch(er => console.log(er))
  }

  @action.bound
  async signOut() {
    await AsyncStorage.removeItem('userToken');
  }

  @action.bound async deleteAccount() {

  }

  @action
  async fetchSignUp({username, password}){
    this.signUpIsLoading = true;

    const url = serverUrl + 'auth/signup';
    const method = 'POST';
    const body = JSON.stringify({
      username,
      password
    });

    try {
      let res = await fetch(url, { method, body });
      let resJson = await res.json();
      return resJson;
    } catch(err) {
      return err.message;
    } finally {
      this.signUpIsLoading = false;
    }
  }

  @action
  async fetchSignIn({username, password}){
    const url = serverUrl + 'auth/signin';
    const method = 'POST';
    const body = JSON.stringify({
      username,
      password
    });

    try {
      let res = await fetch(url, { method, body });
      let resJson = await res.json();
      return resJson;
    } catch(err) {
      return err.message;
    }
  }

}

const authStore = new ObservableAuthStore();
export default authStore;