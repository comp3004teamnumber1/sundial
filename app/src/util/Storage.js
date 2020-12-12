import AsyncStorage from '@react-native-community/async-storage';

// getStorageKey(key) accepts a string argument 'key'
// and returns the corresponding value if found.
// Otherwise, it returns null.
export async function getStorageKey(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

// setStorageKey(key, value) accepts 2 string arguments
// 'key' and 'value', then returns true if successful.
// Otherwise, it returns false.
export async function setStorageKey(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getSettings() {
  try {
    let settings = JSON.parse(await getStorageKey('settings'));
    return settings;
  }
  catch (e) {
    return null;
  }
}

// May be a useful wrapper
export async function getSessionKey() {
  return getStorageKey('session_key');
}
