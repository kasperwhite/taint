import { observable, action, computed } from "mobx";
import { AsyncStorage } from 'react-native';
import * as crypto from 'crypto-js';
import { sendRequest, socket } from './NetService';
import authStore from './AuthStore';
const forge = require('node-forge');
const pki = forge.pki;
const rsa = forge.pki.rsa;

class ObservableRoomMessageStore {
  @observable roomId = '';
  @observable roomMessages = [];

  @observable messagesIsLoading = false;
  @observable postMessageIsLoading = false;

  @observable messagesIsSuccess = false;
  @observable postMessageIsSuccess = false;

  @observable joinedSocketUsers = [];
  @observable establishIsLoading = false;
  @observable establishIsSuccess = false;
  @observable privateKeyPem = '';

  constructor(){ }

  @computed get messages() {
    return this.roomMessages;
  }

  @computed get joinedUsers() {
    return this.joinedSocketUsers;
  }
  set joinedUsers(users) {
    this.joinedSocketUsers = users;
  }
  
  @action.bound async getRoomMessages() {
    const result = await this.fetchGetMessages(this.roomId);
    this.messagesIsSuccess = result.success;
    if(result.success){ this.roomMessages = result.res.reverse() }
    return result;
  }

  @action.bound async postRoomMessage(messageData) {
    const roomId = this.roomId;

    /* const groupKey = await AsyncStorage.getItem(`room/${roomId}/groupKey`);
    const encMessageText = crypto.AES.encrypt(messageData.text, groupKey, { padding: crypto.pad.Iso10126 });
    messageData.text = encMessageText.toString(); */

    const result = await this.fetchPostMessage(roomId, messageData);
    this.postMessageIsSuccess = result.success;
    if(result.success){
      const message = result.res;
      socket.emit('messageCreate', {message: JSON.stringify(message), roomId});
    }
    return result
  }

  @action async fetchGetMessages(roomId){
    this.messagesIsLoading = true;

    const url = 'rooms/' + roomId + '/messages';
    const method = 'GET';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers);
      this.messagesIsLoading = false;
      this.postMessageIsLoading = false;
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action async fetchPostMessage(roomId, data){
    this.postMessageIsLoading = true;

    const url = 'rooms/' + roomId + '/messages';
    const method = 'POST';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${authStore.userToken}`
    };

    try {
      let res = await sendRequest(url, method, headers, data);
      return res;
    } catch(err) {
      console.log(err);
    }
  }

  @action.bound joinRoom() {
    socket.on('joinedUsers', users => {
      this.joinedUsers = users;
    });
    socket.on('messageCreate', async message => {
      /* const groupKey = await AsyncStorage.getItem(`room/${this.roomId}/groupKey`);
      const decMessageText = crypto.AES.decrypt(message.text, groupKey, { padding: crypto.pad.Iso10126 });
      message.text = decMessageText.toString(); */

      this.roomMessages.unshift(JSON.parse(message));
      this.postMessageIsLoading = false;
    });
    this.addEstablishListeners();

    socket.emit('roomJoin', this.roomId);
  }

  @action.bound leaveRoom() {
    socket.removeEventListener('messageCreate');
    socket.removeEventListener('joinedUsers');
    this.removeEstablishListeners();

    socket.emit('roomLeave', this.roomId);
  }

  @action addEstablishListeners() {
    socket.on('establishStart', () => {
      this.establishIsLoading = true;
    })
    socket.on('establishEnd', ({success}) => {
      this.establishIsLoading = false;
      this.establishIsSuccess = success;
    })
    socket.on('establish', async data => {
      if(data.memberType == 'captureMemberDefault'){
        let keyPair = await this.generateKeyPair();
        this.privateKeyPem = keyPair.privateKeyPem;
        socket.emit('establishResponse', keyPair.publicKeyPem);
      } else if(data.memberType == 'captureMemberLast'){
        let groupKey = await this.generateGroupKey();
        let encryptedKeys = await this.encryptGroupKey(groupKey, data.publicKeys);
        socket.emit('establishResponse', encryptedKeys);
      }
    })
    socket.on('groupKey', async key => {
      let privateKey = pki.privateKeyFromPem(this.privateKeyPem);
      let groupKey = privateKey.decrypt(key);
      console.log(groupKey);
      await AsyncStorage.setItem(`room/${this.roomId}/groupKey`, groupKey);
    })
  }
  @action removeEstablishListeners() {
    socket.removeEventListener('establishStart');
    socket.removeEventListener('establishEnd');
    socket.removeEventListener('establish');
    socket.removeEventListener('groupKey');
  }

  @action generateKeyPair() {
    return new Promise((res, rej) => {
      let { publicKey, privateKey } = rsa.generateKeyPair({bits: 512, workers: -1, e: 0x10001}); // todo: fix keySize
      let publicKeyPem = pki.publicKeyToPem(publicKey);
      let privateKeyPem = pki.privateKeyToPem(privateKey);

      res({ publicKeyPem, privateKeyPem });
    })
  }

  @action generateGroupKey() {
    return new Promise((res, rej) => {
      let salt = crypto.lib.WordArray.random(8);
      let passphrase = crypto.SHA512(new Date().getTime().toString()).toString(crypto.enc.Hex);
      let key512Bits = crypto.PBKDF2(passphrase, salt, { keySize: 4 }).toString(crypto.enc.Hex); // todo: fix keySize

      res(key512Bits);
    })
  }

  @action async encryptGroupKey(groupKey, clients) {
    await clients.forEach(async c => {
      let pubKey = await pki.publicKeyFromPem(c.publicKeyPem);
      c.ecryptedGroupKey = await pubKey.encrypt(groupKey);
    })
    
    return clients;
  }

}

const roomMessageStore = new ObservableRoomMessageStore();
export default roomMessageStore;