import AsyncStorage from '@react-native-community/async-storage';

export async function getStorageKey(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export async function setStorageKey(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getSessionKey() {
  return getStorageKey('session_key');
}

export const constants = {
  SERVER_URL: 'https://sundial.vinhnguyen.ca' || 'http://10.0.2.2:5000',
};

export const dummy = {
  weeklyViewTestPayload: [
    {
      date: 1602960464,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather_type: 'Clouds',
      pop: 32,
      humidity: 12,
    },
    {
      date: 1603046864,
      temp: {
        c: 2.8,
        f: 71.2,
        k: 295.95,
      },
      weather_type: 'Clear',
      pop: 32,
      humidity: 12,
    },
    {
      date: 1603133264,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather_type: 'Clear',
      pop: 32,
      humidity: 12,
    },
    {
      date: 1602097200,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather_type: 'Clear',
      pop: 32,
      humidity: 12,
    },
    {
      date: 1603392464,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather_type: 'Clear',
      pop: 32,
      humidity: 12,
    },
    {
      date: 1603478864,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather_type: 'Clear',
      pop: 32,
      humidity: 12,
    },
  ],
  hourlyViewTestPayload: [
    {
      date: 1602086400,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather: 'Clear',
    },
    {
      date: 1602090000,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather: 'Clear',
    },
    {
      date: 1602093600,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather: 'Clear',
    },
    {
      date: 1602097200,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather: 'Clear',
    },
    {
      date: 1602100800,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather: 'Clear',
    },
    {
      date: 1602104400,
      temp: {
        c: 21.8,
        f: 71.2,
        k: 295.95,
      },
      weather: 'Clear',
    },
  ],
};
