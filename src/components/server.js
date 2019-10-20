import React, { useState, useEffect, Fragment } from 'react';
import {
  Typography,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Button,
  Dialog,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import styled from 'styled-components';
import * as firebase from 'firebase';
import 'firebase/database';
import CloseIcon from '@material-ui/icons/Close';
import randomColor from 'randomcolor';

import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';

import RoomDetails from './room-details';
import { generateBoard } from './board';

const ServerListContainer = styled.div`
  display: grid;
  grid-template-areas: 'rooms-list room-details';
  grid-template-columns: 1fr 4fr;
  height: 100%;
`;

const RoomsList = styled.div`
  grid-area: rooms-list;
  display: grid;
  height: 95vh;
  padding: 2em;
  margin-right: 1em;
  grid-template-rows: 100px 1fr 50px;
  background-color: ${props => props.theme.palette.grey[100]};
  border-right: 1px solid ${props => props.theme.palette.primary.main};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const RoomFormContainer = styled.div`
  padding: 3em;
  min-width: 30vw;
  min-height: 25vw;
  display: grid;
  grid-template-rows: 2em 1fr 2em;
`;

const RoomFormClose = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const RoomForm = styled.form`
  display: grid;
  grid-auto-flow: row;
  padding: 2em;
  justify-content: center;
  align-items: center;
  grid-gap: 0.5em;
`;

const ListStyled = styled(List)`
  overflow: auto;
`;

function Server({ userId }) {
  const [firestore] = useState(firebase.firestore());
  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(false);

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [language, setLanguage] = useState('');
  const [advanced, setAdvanced] = useState(false);

  const [room, setRoom] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const detach = firestore.collection('rooms').onSnapshot(snapshot => {
      const rooms = [];
      snapshot.forEach(room => {
        rooms.push({ data: room.data(), id: room.id });
      });
      setRooms(rooms);
    });
    return () => detach();
  }, [firestore]);

  useEffect(() => {
    const detach = firestore.collection('roomDetail').onSnapshot(snapshot => {
      snapshot.forEach(room => {
        if (room.id === roomId) {
          setRoom(room.data());
        }
      });
    });
    return () => detach();
  }, [firestore, roomId]);

  async function createRoom() {
    setModal(false);
    const docRef = await firestore.collection('rooms').add({
      name,
      capacity,
      language,
      type: advanced ? 'advanced' : 'normal'
    });

    firestore.collection('roomDetail').add({
      board: generateBoard(capacity < 50 ? capacity : 50),
      players: [],
      roomId: docRef.id
    });
  }

  function chooseRoom(room) {
    firestore
      .collection('roomDetail')
      .where('roomId', '==', room.id)
      .get()
      .then(snapshot => {
        snapshot.forEach(dataRoom => {
          const data = dataRoom.data();
          firestore
            .collection('roomDetail')
            .doc(dataRoom.id)
            .update({
              players: [
                ...data.players.filter(player => player.id !== userId),
                { id: userId, color: randomColor() }
              ]
            })
            .then(() => {
              firestore
                .collection('roomDetail')
                .doc(dataRoom.id)
                .get()
                .then(updatedRoom => {
                  const updatedData = updatedRoom.data();
                  setRoom(updatedData);
                  setRoomId(updatedRoom.id);
                });
            });
        });
      });
  }

  async function updatePiece(newStateBoard) {
    if (!roomId) {
      return;
    }

    await firestore
      .collection('roomDetail')
      .doc(roomId)
      .update({
        board: newStateBoard
      });

    const data = await firestore
      .collection('roomDetail')
      .doc(roomId)
      .get();
    setRoom(data.data());
  }

  return (
    <Fragment>
      <Dialog open={modal}>
        <RoomFormContainer>
          <RoomFormClose>
            <IconButton onClick={() => setModal(false)}>
              <CloseIcon />
            </IconButton>
          </RoomFormClose>
          <RoomForm
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <Typography align="center" variant="h5" color="primary">
              Add a new room
            </Typography>
            <TextField
              variant="outlined"
              label="Room name"
              value={name}
              onChange={event => setName(event.target.value)}
            />
            <TextField
              variant="outlined"
              label="Capacity"
              type="number"
              value={capacity}
              error={capacity > 50}
              onChange={event => setCapacity(event.target.value)}
            />
            <TextField
              variant="outlined"
              label="Language"
              value={language}
              onChange={event => setLanguage(event.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value={advanced}
                  onChange={(_event, checked) => setAdvanced(checked)}
                />
              }
              label="Advanced game"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={createRoom}
            >
              Add
            </Button>
          </RoomForm>
        </RoomFormContainer>
      </Dialog>
      <ServerListContainer>
        {!room && (
          <RoomsList>
            <Typography align="center" variant="h3" color="primary">
              Rooms list
            </Typography>
            <ListStyled>
              {rooms.map(room => (
                <ListItem button key={room.id} onClick={() => chooseRoom(room)}>
                  <ListItemIcon>
                    {room.data.type === 'advanced' ? (
                      <DirectionsRunIcon />
                    ) : (
                      <DirectionsWalkIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={room.data.name}
                    secondary={`Capacity: ${room.data.capacity}, language: ${room.data.language}`}
                  />
                </ListItem>
              ))}
            </ListStyled>
            <Button
              onClick={() => setModal(true)}
              variant="contained"
              color="primary"
            >
              Add a room
            </Button>
          </RoomsList>
        )}
        <RoomDetails
          setRoom={setRoom}
          room={room}
          user={userId}
          updatePiece={updatePiece}
        />
      </ServerListContainer>
    </Fragment>
  );
}

export default Server;
