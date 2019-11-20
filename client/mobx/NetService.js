import { serverUrl } from './config';

export const sendRequest = async (url, method, headers, data) => {
  console.log('request: ', url, method, headers, data);
  try {
    let res = await fetch(serverUrl + url, {
      method,
      headers,
      body: method == 'GET' ? null : JSON.stringify(data)
    })
    let resJson = await res.json();
    console.log('response: ', resJson);
    return resJson;
  } catch(err) {
    console.log(err)
  }
}