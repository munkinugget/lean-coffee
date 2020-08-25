import { socket, room } from './AuthApi';
import debounce from 'lodash.debounce';

// Auto debounce!
export const updateNote = debounce((note) => {
  socket.emit('UPDATE_NOTE', note);
}, 250);

export const createNote = () => {
  socket.emit('CREATE_NOTE');
}

export const deleteNote = (id) => {
  socket.emit('DELETE_NOTE', id);
}

