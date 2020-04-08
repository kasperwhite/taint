import { serverUrl } from './config';
import io from 'socket.io-client';

export const sendRequest = async (url, method, headers, data) => {
  //console.log('request: ', url, method, headers, data);
  try {
    let res = await fetch(serverUrl + url, {
      method,
      headers,
      body: method == 'GET' ? null : JSON.stringify(data)
    })
    if(res.ok){
      let resJson = await res.json();
      //console.log('response: ', resJson);
      return {success: true, res: resJson};
    } else {
      return {success: false, error: res.statusText}
    }
  } catch(err) {
    return {success: false, error: err};
  }
}

export const socket = io.connect(serverUrl, { secure: true });