import { observable, action } from "mobx";

class ObservableSettingsStore {
  @observable settings = {};
  @observable isLoading = false;

  constructor(){ }

  @action.bound async getSettings() {

  }

  @action.bound async changeSettings() {

  }

  @action.bound async restoreSettings() {

  }
}

const settingsStore = new ObservableSettingsStore();
export default settingsStore;