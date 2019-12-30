import { observable, action, computed } from "mobx";
import { sendRequest } from './NetService';

import authStore from './AuthStore';

class ObservableSettingsStore {
  @observable settingsData = { };

  @observable changePasswordIsLoading = false;
  @observable changeUsernameIsLoading = false;
  @observable changeVisibleIsLoading = false;

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