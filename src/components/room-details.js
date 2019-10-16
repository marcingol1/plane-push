import React from 'react';
import { Typography } from '@material-ui/core';

function RoomDetails({ room }) {
  return <Typography variant="h5">{room ? 'Room details' : ''}</Typography>;
}

export default RoomDetails;
