import { observable, action } from "mobx";
import { sendRequest } from './NetService';

import authStore from './AuthStore';

class ObservableSettingsStore {
  @observable settings = {};

  @observable changePasswordIsLoading = false;

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
}

const settingsStore = new ObservableSettingsStore();
export default settingsStore;