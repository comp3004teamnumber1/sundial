import React from 'react';
import { Feather } from '@expo/vector-icons';

let icon = (description = '', size = 48, color = 'white') => {
  //The default size and colour were chosen due to those values being used for the Weekly and Hourly Views
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
};

export { icon }