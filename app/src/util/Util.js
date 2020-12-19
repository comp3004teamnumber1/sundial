import React from 'react';
import { Feather } from '@expo/vector-icons';

export function getWindDirection(degree) {
  const deg = degree % 360;
  switch (true) {
    case deg >= 348.75 || deg < 11.25:
      return 'NNE';
    case deg >= 33.75 || deg < 56.25:
      return 'NE';
    case deg >= 56.25 || deg < 78.75:
      return 'ENE';
    case deg >= 78.75 || deg < 101.25:
      return 'E';
    case deg >= 101.25 || deg < 123.75:
      return 'ESE';
    case deg >= 123.75 || deg < 146.25:
      return 'SE';
    case deg >= 146.25 || deg < 168.75:
      return 'SSE';
    case deg >= 168.25 || deg < 191.25:
      return 'S';
    case deg >= 191.25 || deg < 213.75:
      return 'SSW';
    case deg >= 213.25 || deg < 236.25:
      return 'SW';
    case deg >= 236.25 || deg < 258.75:
      return 'WSW';
    case deg >= 258.25 || deg < 281.25:
      return 'W';
    case deg >= 281.25 || deg < 303.75:
      return 'WNW';
    case deg >= 303.25 || deg < 326.25:
      return 'NW';
    case deg >= 326.25 || deg < 348.75:
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
    case 'Metric':
      return {
        temp: '°C',
        wind: 'm/s',
      };
    case 'Imperial':
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
