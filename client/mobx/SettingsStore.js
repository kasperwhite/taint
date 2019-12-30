import { observable, action } from "mobx";
import { sendRequest } from './NetService';

import authStore from './AuthStore';

class ObservableSettingsStore {
  @observable settings = {};

  @observable changePasswordIsLoading = false;
  @observable changeUsernameIsLoading = false;

  constructor(){ }

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
}

const settingsStore = new ObservableSettingsStore();
export default settingsStore;