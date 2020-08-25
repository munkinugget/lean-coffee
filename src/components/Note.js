import React, { useState } from 'react';
import { Paper, TextField, colors, Box, IconButton, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { user, getInitials, getFullName } from '../api/AuthApi';
import { updateNote, deleteNote } from '../api/NotesApi';

const useStyles = makeStyles((theme) => ({
  postit: {
    width: '15rem',
    minHeight: '15rem',
    // needs relative position to contain the avatar
    position: 'relative'
  },
  postitAvatar: {
    position: 'absolute',
    top: -theme.spacing(2),
    right: -theme.spacing(2)
  },
  postitControlBar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  postitBody: {
    ...theme.typography.body1,
    padding: theme.spacing(2)
  }
}));

function Note(props) {
  const { id, owner, value } = props;
  const [innerValue, updateInnerValue] = useState(value);
  const classes = useStyles();

  const handleOnChange = (event) => {
    const val = event.target.value;
    updateInnerValue(val);
    updateNote({ id, owner, value: val });
  };

  const handleDelete = () => deleteNote(id);

  return (
    <Grid key={id} item>
      <Paper elevation={3} className={classes.postit} style={{backgroundColor: owner.color[200]}}>
        <Avatar
          alt={getFullName(owner)}
          className={classes.postitAvatar}
          style={{backgroundColor: owner.color[400]}}
        >
          {getInitials(owner)}
        </Avatar>
        <div>
          {
            owner.id === user.id ? (
              <TextField
                id={id}
                multiline
                rowsMax={8}
                value={innerValue}
                onChange={handleOnChange}
              />
            ) : (
              <div className={classes.postitBody}>{innerValue}</div>
            )
          }
        </div>
        {
          owner.id === user.id && (
            <div className={classes.postitControlBar}>
              <IconButton aria-label="delete" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          )
        }
      </Paper>
    </Grid>
  );
}

export default Note;
