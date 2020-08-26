import { socket, user } from './AuthApi';

// Auto debounce!
export const createRoom = () => {
  socket.emit('CREATE_ROOM');
};

export const joinRoom = (room) => {
  socket.emit('JOIN_ROOM', room);
}


