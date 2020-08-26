import { socket, user } from './AuthApi';

// Auto debounce!
export const createRoom = () => {
  socket.emit('CREATE_ROOM', { user });
};

export const joinRoom = (room) => {
  socket.emit('JOIN_ROOM', room);
}


