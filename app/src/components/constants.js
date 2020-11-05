import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';
import React from 'react';

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

export function getWeatherIcon(weather) {
  switch (weather) {
    case 'Clear':
      return <Feather name='sun' size={48} color='white' />;
    case 'Clouds':
      return <Feather name='cloud' size={48} color='white' />;
    case 'Rain':
      return <Feather name='cloud-rain' size={48} color='white' />;
    case 'Drizzle':
      return <Feather name='cloud-drizzle' size={48} color='white' />;
    case 'Thunderstorm':
      return <Feather name='cloud-lightning' size={48} color='white' />;
    case 'Snow':
      return <Feather name='cloud-snow' size={48} color='white' />;
    default:
      return <Feather name='help-circle' size={48} color='white' />;
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
  taskPayload: [
    {
      id: 1,
      task: "Eat lunch",
      date: 1602104400,
      ideal_weather: "Clear",
      location: "Ottawa"
    },
    {
      id: 2,
      task: "Eat Dinner",
      date: 1602114400,
      ideal_weather: "Clouds",
      location: "Ottawa"
    },
    {
      id: 3,
      task: "Eat Yourself",
      date: 1602124400,
      ideal_weather: "Clear",
      location: "Ottawa"
    },
    {
      id: 4,
      task: "Eat myself",
      date: 1602134400,
      ideal_weather: "Rain",
      location: "Ottawa"
    },
  ]
};
