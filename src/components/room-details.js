import React, { Fragment } from 'react';
import Board from './board';

function RoomDetails({ room, user, updatePiece }) {
  if (!room) {
    return null;
  }
  const player = room.players.find(player => player.id === user);
  return (
    <Fragment>
      <Board
        board={room.board}
        color={player.color}
        updatePiece={updatePiece}
      />
    </Fragment>
  );
}

export default RoomDetails;
