import React, { useState, useEffect } from 'react';
import { socket } from './api/AuthApi';
import { AppBar, Typography, Container, Box } from '@material-ui/core';
import RoomSelection from './views/RoomSelection';
import Topics from './views/Topics';
import qs from 'query-string';
import { joinRoom } from './api/RoomApi';

function App(props) {
  const [state, updateState] = useState({});
  const { id, notes = [], users = [], view = '' } = state;

  // check the query for a room id, and auto join
  useEffect(() => {
    const { room } = qs.parse(window.location.search);
    if (room) {
      joinRoom(room);
    }
  }, [])
  
  // update the state!
  socket.on('UPDATE_STATE', (data) => {
    if (window.history.pushState) {
      const roomString = qs.stringify({ room: data.id });
      const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + roomString;
      window.history.pushState({ path: newurl }, '', newurl);
    }

    updateState(data);
  });

  // really basic in mem router
  let currentView;

  switch (view) {
    case '':
      currentView = <RoomSelection />;
      break;
    case 'TOPICS':
      currentView = <Topics {...{ notes, users }}/>;
      break;
    default:
      currentView = <RoomSelection />;
      break;
  }

  return (
    <Container>
      <AppBar>
        <Box m={1}>
          <Typography variant="h6" color="inherit">
            Lean Coffee { id ? `(Room: ${id})` : '' }
          </Typography>
        </Box>
      </AppBar>

      <Box mt={8}>
        {currentView}
      </Box>
    </Container>
  );
}

export default App;
