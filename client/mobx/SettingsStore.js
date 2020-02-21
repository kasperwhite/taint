import { observable, action, computed } from "mobx";
import { sendRequest } from './NetService';
import authStore from './AuthStore';
import { AsyncStorage } from "react-native";
const forge = require('node-forge');

class ObservableSettingsStore {
  @observable settingsData = {
    keyPairLastRefresh: ''
  };

  @observable changePasswordIsLoading = false;
  @observable changeUsernameIsLoading = false;
  @observable changeVisibleIsLoading = false;

  @observable keypairDataIsLoading = false;
  @observable keypairIsRefreshing = false;

  constructor(){ }

  @computed get settings() {
    return this.settingsData;
  }

  set settings(data) {
    this.settingsData = data;
  }

  @action.bound async getSettings() {

  }

  @action.bound async changeSettings() {

  }

  @action.bound async restoreSettings() {

  }

  @action.bound async changePassword({oldPass, newPass}) {
    const result = await this.fetchChangePassword({oldPass, newPass, userId: authStore.user._id});
    return result;
  }

  @action.bound async changeUsername({newUsername}) {
    const result = await this.fetchChangeUsername({newUsername, userId: authStore.user._id});
    if(result.success) { authStore.user = result.res }
    return result;
  }

  @action.bound async changeVisible({value}) {
    const result = await this.fetchChangeVisible({value, userId: authStore.user._id});
    if(result.success) { authStore.user = result.res }
    return result;
  }

  @action.bound async getKeypairData() {
    this.keypairDataIsLoading = true;
    this.settingsData.keyPairLastRefresh = await AsyncStorage.getItem('userKeypairTime');
    this.keypairDataIsLoading = false;
  }

  @action.bound async refreshKeypair() {
    this.keypairIsRefreshing = true;
    await this.setNewKeypair();
    this.settingsData.keyPairLastRefresh = await AsyncStorage.getItem('userKeypairTime');
    this.keypairIsRefreshing = false;
  }

  @action setNewKeypair() {
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
        console.log(err);
        rej(err);
      }
    })
  }

  @action async fetchChangePassword(data) {
    this.changePasswordIsLoading = true;

    const url = 'auth/change_password';
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };

    try {
      let res = await sendRequest(url, method, headers, data);
      this.changePasswordIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action async fetchChangeUsername(data) {
    this.changeUsernameIsLoading = true;

    const url = 'auth/change_username';
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };

    try {
      let res = await sendRequest(url, method, headers, data);
      this.changeUsernameIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action async fetchChangeVisible(data) {
    this.changeVisibleIsLoading = true;

    const url = 'auth/change_visible';
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };

    try {
      let res = await sendRequest(url, method, headers, data);
      this.changeVisibleIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }
}

const settingsStore = new ObservableSettingsStore();
export default settingsStore;