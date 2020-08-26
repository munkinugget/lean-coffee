import React, { Fragment } from 'react';
import { Button, Grid } from '@material-ui/core';
import UserAvatars from '../components/UserAvatars';
import Note from '../components/Note';
import { createNote } from '../api/NotesApi';

function Topics(props) {
  const { users, notes } = props;
  return (
    <Fragment>
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

export default Topics;
