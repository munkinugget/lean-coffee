import React, { useState, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

import { user, room, socket } from './api/AuthApi';
import Note from './components/Note';
import { Button, Grid, AppBar, Typography, Container, Box } from '@material-ui/core';
import { createNote } from './api/NotesApi';
import UserAvatars from './components/UserAvatars';

socket.on('connect', () => {
  socket.emit('CREATE_ROOM', { room, user });
});

function App() {
  const [state, updateState] = useState({});

  socket.on('UPDATE_STATE', (data) => {
    updateState(data);
  });

  const { notes = [], users = [] } = state;

  return (
    <Fragment>
      <AppBar>
        <Typography variant="h6" color="inherit">
          Photos
        </Typography>
      </AppBar>
      <Container>
        <Box my={2}>

        </Box>
      </Container>
      <Button variant="contained" color="primary" onClick={createNote}>Add!</Button>
      <UserAvatars users={users}/>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={2}
      >
        {notes.map(({ id, owner, value }) => (
          <Note id={id} owner={owner} value={value} key={id} />
        ))}
      </Grid>
    </Fragment>
  );
}

export default App;
