import React from 'react';
import { Feather } from '@expo/vector-icons';

export function getWindDirection(degree) {
  const deg = degree % 360;
  switch (deg) {
    case degree >= 348.75 || degree < 11.25:
      return 'NNE';
    case degree >= 33.75 || degree < 56.25:
      return 'NE';
    case degree >= 56.25 || degree < 78.75:
      return 'ENE';
    case degree >= 78.75 || degree < 101.25:
      return 'E';
    case degree >= 101.25 || degree < 123.75:
      return 'ESE';
    case degree >= 123.75 || degree < 146.25:
      return 'SE';
    case degree >= 146.25 || degree < 168.75:
      return 'SSE';
    case degree >= 168.25 || degree < 191.25:
      return 'S';
    case degree >= 191.25 || degree < 213.75:
      return 'SSW';
    case degree >= 213.25 || degree < 236.25:
      return 'SW';
    case degree >= 236.25 || degree < 258.75:
      return 'WSW';
    case degree >= 258.25 || degree < 281.25:
      return 'W';
    case degree >= 281.25 || degree < 303.75:
      return 'WNW';
    case degree >= 303.25 || degree < 326.25:
      return 'NW';
    case degree >= 326.25 || degree < 348.75:
      return 'NNW';
    case Number.isNaN(deg):
    default:
      return '';
  }
}

export function getIcon(description = '', size = 48, color = 'white') {
  // The default size and colour were chosen due to those values being
  // used for the Weekly and Hourly Views
  let name = description.toLowerCase();
  switch (name) {
    case 'wind':
      return <Feather name='wind' size={size} color={color} />;
    case 'drop':
      return <Feather name='droplet' size={size} color={color} />;

    case 'clear':
      return <Feather name='sun' size={size} color={color} />;
    case 'clouds':
      return <Feather name='cloud' size={size} color={color} />;
    case 'rain':
      return <Feather name='cloud-rain' size={size} color={color} />;
    case 'drizzle':
      return <Feather name='cloud-drizzle' size={size} color={color} />;
    case 'thunderstorm':
      return <Feather name='cloud-lightning' size={size} color={color} />;
    case 'snow':
      return <Feather name='cloud-snow' size={size} color={color} />;

    default:
      return <Feather name='help-circle' size={size} color={color} />;
  }
}

export function getUnits(preference) {
  switch (preference) {
    case 'metric':
      return {
        temp: '°C',
        wind: 'm/s',
      };
    case 'imperial':
      return {
        temp: '°F',
        wind: 'mi/h',
      };
    default:
      return {
        temp: '',
        wind: '',
      };
  }
}
