import React from 'react';
import { Paper, Box, Button, Divider } from '@material-ui/core';
import { createRoom } from '../api/RoomApi';

function RoomSelection(props) {
  return (
    <Paper elevation={3}>
      <Box p={1}>
        <Button onClick={createRoom}>Create a new room</Button>
        <Divider variant="middle"/>
        <Button disabled>Join room</Button>
      </Box>
    </Paper>
  );
}

export default RoomSelection;
