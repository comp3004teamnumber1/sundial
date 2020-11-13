import axios from 'axios';
import { getSessionKey } from './Storage';
import constants from '../data/constants';

const NAME = 'API';

// the ultimate function to beat them all
export default async function query(route, method = 'get', data) {
  // basic checks
  if (!route) {
    console.log(`${NAME}: No route provided`);
    return null;
  }
  // special case
  if (route === 'login' || route === 'register') {
    // make the request
    const res = await axios({
      url: `${constants.SERVER_URL}/${route}`,
      method: 'post',
      data,
    });
    // check if request was good
    if (res.status !== 200) {
      console.log(`${NAME}: Error making request from server`);
      return null;
    }
    // return the data
    return res.data;
  }

  const key = await getSessionKey();
  if (key === null) {
    console.log(`${NAME}: Error retrieving key`);
    return null;
  }

  // build up our config
  const methodLC = method.toLowerCase();
  const isParams = ['get', 'delete'].includes(methodLC);
  const config = {
    url: `${constants.SERVER_URL}/${route}`,
    method: methodLC,
    headers: { 'Session-Key': key },
  };
  if (isParams) {
    config.params = data;
  } else {
    config.data = data;
  }

  // make the request
  const res = await axios(config);

  // check if request was good
  if (res.status !== 200) {
    console.log(`${NAME}: Error making request from server`);
    return null;
  }

  // return the data
  return res.data;
}
