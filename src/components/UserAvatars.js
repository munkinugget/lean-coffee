import React from 'react';
import { Avatar } from '@material-ui/core';
import { getInitials, getFullName } from '../api/AuthApi';


function UserAvatars(props) {
  const { users = [] } = props;

  return (
    <div>
      {
        users.map((user) => (
          <Avatar
            alt={getFullName(user)}
            style={{backgroundColor: user.color[400]}}
          >
            {getInitials(user)}
          </Avatar>
        ))
      }
    </div>
  );
}

export default UserAvatars;
