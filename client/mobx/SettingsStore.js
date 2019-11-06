import { observable, action } from "mobx";

class ObservableSettingsStore {
  @observable settings = {};
  @observable isLoading = false;

  constructor(){ }

  @action.bound getSettings() {

  }

  @action.bound changeSettings() {

  }

  @action.bound restoreSettings() {

  }
}

const settingsStore = new ObservableSettingsStore();
export default settingsStore;