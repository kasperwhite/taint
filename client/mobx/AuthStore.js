import { observable, action } from "mobx";
import { AsyncStorage } from "react-native";

class ObservableAuthStore {
  @observable isLoading = false;
  @observable userId = '';
  @observable userToken = '';

  constructor(){ }

  @action.bound async signIn({username, password}) {
    console.log(username, password);

    await AsyncStorage.setItem('userToken', '1234-5678');
  }

  @action.bound async signUp({username, password}) {
    console.log(username, password);

    
  }

  @action.bound async signOut() {
    await AsyncStorage.removeItem('userToken');
  }

  @action.bound deleteAccount() {

  }
}

const authStore = new ObservableAuthStore();
export default authStore;