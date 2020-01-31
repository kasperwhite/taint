import { observable, action, computed } from "mobx";
import * as crypto from 'crypto-js';
import { sendRequest, socket } from './NetService';
import authStore from './AuthStore';
const forge = require('node-forge');
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
    const result = await this.fetchPostMessage(roomId, messageData);
    this.postMessageIsSuccess = result.success;
    if(result.success){
      const message = result.res;
      // this.roomMessages.unshift(message);
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
    socket.on('establishStart', () => {
      this.establishIsLoading = true;
    })
    socket.on('establishEnd', ({success}) => {
      this.establishIsLoading = false;
      this.establishIsSuccess = success;
    })
    socket.on('messageCreate', message => {
      this.roomMessages.unshift(JSON.parse(message));
      this.postMessageIsLoading = false;
    });
    socket.on('establish', async data => {
      if(data.memberType == 'captureMemberDefault'){
        let keyPair = await this.generateKeyPair();
        socket.emit('establishResponse', keyPair.publicKey);
      } else if(data.memberType == 'captureMemberLast'){
        console.log(data.publicKeys);
      }
    })

    socket.emit('roomJoin', this.roomId);
  }

  @action.bound leaveRoom() {
    socket.removeEventListener('messageCreate');
    socket.removeEventListener('joinedUsers');
    socket.removeEventListener('establishStart');
    socket.removeEventListener('establishEnd');
    socket.removeEventListener('establish');
    socket.emit('roomLeave', this.roomId);
  }

  /* @action generateKey() {
    let salt = crypto.lib.WordArray.random(128/8);
    let passphrase = crypto.SHA512(new Date().getTime().toString()).toString(crypto.enc.Hex);
    let key512Bits = crypto.PBKDF2(passphrase, salt, { keySize: 512/32 }).toString(crypto.enc.Hex);

    return key512Bits;
  } */

  @action generateKeyPair() {
    return new Promise((res, rej) => {
      let { publicKey, privateKey } = rsa.generateKeyPair({bits: 512, workers: -1});
      res({ publicKey, privateKey });
    })
  }

}

const roomMessageStore = new ObservableRoomMessageStore();
export default roomMessageStore;