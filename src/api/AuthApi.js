import io from 'socket.io-client';
import { colors } from '@material-ui/core';

const randomColor = () => {
  const keys = Object.keys(colors);
  return colors[keys[keys.length * Math.random() << 0]];
};

export const socket = io();

export const user = { id: '319837', firstName: 'Matt', lastName: 'Cavanaugh', color: randomColor() };

export const room = 'AXSDF123';

export const getInitials = (user) => {
  const { firstName, lastName } = user;
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

export const getFullName = (user) => {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}