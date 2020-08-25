const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const loki = require('lokijs');
const {
  v4: uuidv4
} = require('uuid');

const db = new loki('lean-coffee');
const rooms = db.addCollection('rooms');
const colors = require('@material-ui/core/colors')

// const bodyParser = require('body-parser');
const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Server actions accepted
const VERBS = {
  CREATE_ROOM: 'CREATE_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  CREATE_NOTE: 'CREATE_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  UPDATE_STATE: 'UPDATE_STATE',
};

const randomColor = () => {
  const keys = Object.keys(colors);
  return colors[keys[keys.length * Math.random() << 0]];
};

io.on('connection', (socket) => {
  const {
    CREATE_ROOM,
    JOIN_ROOM,
    UPDATE_NOTE,
    UPDATE_STATE,
    CREATE_NOTE,
    DELETE_NOTE
  } = VERBS;

  socket.on('message', (data) => {
    console.log(data);
  });

  socket.on(CREATE_ROOM, ({
    user,
    room
  }) => {
    console.log(`User ${user.id} is creating room ${room}`);
    socket.user = user;
    socket.room = room;

    const testUser = {
      ...user,
      id: '123456',
      firstName: 'Kristina',
      color: randomColor()
    };

    socket.join(room, (err) => {
      if (err === null) {
        console.log(`User ${user.id} created room ${room}`);
        // insert a new room in the db
        const newRoom = {
          id: room,
          owner: user,
          users: [user, testUser],
          notes: [{
              id: uuidv4(),
              value: '',
              owner: user
            },
            {
              id: uuidv4(),
              value: 'Test note',
              owner: testUser
            }
          ],
          state: 'TOPICS'
        };

        const existing = rooms.findOne({
          id: room
        });

        if (!existing) {
          console.log('New room created');
          rooms.insert(newRoom);
          io.in(room).emit(UPDATE_STATE, newRoom);
        } else {
          console.log('Existing room found');
          io.in(room).emit(UPDATE_STATE, existing);
        }
      }
    });
  });

  socket.on(JOIN_ROOM, ({
    user,
    room
  }) => {
    const {
      id,
      firstName
    } = user;

    console.log(`User id: ${id} is attempting to join room ${room}`);
    socket.user = user;
    let rooms = Object.keys(socket.rooms);
    console.log(rooms);
    io.in(socket.room).emit(UPDATE_STATE, currentRoom);
    socket.to(room).send(`${firstName} joined the room`);
  });

  socket.on(UPDATE_NOTE, (note) => {
    const {
      user,
      room
    } = socket;
    console.log(`User ${user.id} is updating note ${note.id}`);

    const currentRoom = rooms.findOne({
      id: room
    });
    currentRoom.notes = currentRoom.notes.map(n => n.id === note.id ? note : n);

    rooms.update(currentRoom);
  });

  socket.on(CREATE_NOTE, (note) => {
    const {
      user,
      room
    } = socket;
    console.log(`User ${user.id} is creating a new note`);

    const currentRoom = rooms.findOne({
      id: room
    });
    currentRoom.notes = [
      ...currentRoom.notes,
      {
        id: uuidv4(),
        owner: user,
        value: ''
      }
    ];

    rooms.update(currentRoom);
    io.in(room).emit(UPDATE_STATE, currentRoom);
  });

  socket.on(DELETE_NOTE, (noteId) => {
    const {
      id
    } = socket.user;
    console.log(`User ${id} is deleting note ${noteId}`);

    const currentRoom = rooms.findOne({
      id: socket.room
    });
    currentRoom.notes = currentRoom.notes.filter((n) => {
      return n.id !== noteId;
    });

    rooms.update(currentRoom);
    io.in(socket.room).emit(UPDATE_STATE, currentRoom);
  });

  socket.on('disconnect', () => {
    console.log(`User id: ${socket.user.id} has disconnected`);
  });
});


http.listen(process.env.PORT || 8080);