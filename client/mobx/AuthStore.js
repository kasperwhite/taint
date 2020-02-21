import { observable, action, computed } from "mobx";
import { AsyncStorage } from "react-native";
import { sendRequest, socket } from './NetService';
const forge = require('node-forge');

class ObservableAuthStore {
  @observable signUpIsLoading = false;
  @observable signInIsLoading = false;

  @observable userData;
  @observable userToken = '';

  constructor(){ }

  @computed get user() {
    return this.userData;
  }

  set user(user) {
    this.userData = user;
  }

  @action.bound async signIn({username, password}) {
    const result = await this.fetchSignIn({username, password});
    if(result.success) {
      const token = result.res.token;
      this.userToken = token;
      await AsyncStorage.setItem('userToken', token);
    }
    return result;
  }

  @action.bound async signUp({username, password}) {
    const result = await this.fetchSignUp({username, password});
    return result;
  }

  @action.bound async signOut() {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userPubKey');
    await AsyncStorage.removeItem('userSecKey');
    await AsyncStorage.removeItem('userKeypairTime');
    socket.emit('offline', this.user._id);
  }

  @action.bound async authenticate() {
    const result = await this.fetchCurrentUser();
    if(result.success){
      this.user = result.res;
      socket.emit('online', this.user._id);
    }
    return result;
  }

  @action.bound async generateKeyPair() {
    return new Promise(async (res, rej) => {
      try {
        let { publicKey, privateKey } = forge.pki.rsa.generateKeyPair({ bits: 1024, workers: 5, e: 0x10001 });
        let publicKeyPem = forge.pki.publicKeyToPem(publicKey);
        let privateKeyPem = forge.pki.privateKeyToPem(privateKey);

        await AsyncStorage.setItem('userPubKey', publicKeyPem);
        await AsyncStorage.setItem('userSecKey', privateKeyPem);
        await AsyncStorage.setItem('userKeypairTime', new Date().toString());

        res();
      } catch(err) {
        rej({error : err});
      }
    })
  }

  @action.bound async deleteAccount() {

  }

  @action async fetchSignUp(data){
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

  @action async fetchSignIn(data){
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

  @action async fetchCurrentUser(){
    
    const url = 'users/me';
    const method = 'GET';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${this.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      return res;
    } catch(err) {
      console.log(err);
    }
  }
}

const authStore = new ObservableAuthStore();
export default authStore;