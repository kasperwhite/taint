import { observable, action } from "mobx";

class ObservableAuthStore {
  @observable isLoading = false;
  @observable userId = '';
  @observable userToken = '';

  constructor(){ }

  @action.bound signIn(userData) {

  }

  @action.bound signUp(userData) {

  }

  @action.bound signOut() {

  }

  @action.bound deleteAccount() {

  }
}

const authStore = new ObservableAuthStore();
export default authStore;