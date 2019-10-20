import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, IconButton } from '@material-ui/core';
import produce from 'immer';
import BackIcon from '@material-ui/icons/ArrowBack';

const AppStyled = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const BoardStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  grid-template-rows: repeat(${props => props.size}, 1fr);
  border: 2px solid ${props => props.theme.palette.primary[500]};
  background-color: ${props => props.theme.palette.primary[600]};
  grid-gap: 2px;
  height: 90vw;
  width: 90vw;
`;

const Piece = styled.div`
  background-color: ${props =>
    props.selected ? props.color : props.theme.palette.secondary[400]};
  height: 100%;
  &:hover {
    background-color: ${props => props.selectColor};
  }
`;

const TitleContainer = styled.div`
  padding: 2em;
`;

function generatePiece() {
  return {
    value: false,
    uid: 0,
    color: 'purple'
  };
}
export function generateBoard(size) {
  return Array.from({ length: size * size }).map(generatePiece);
}

function Board({ setRoom, board, color, updatePiece }) {
  const [boardState, setBoard] = useState(board);

  useEffect(() => {
    setBoard(board);
  }, [board]);

  function togglePiece(index) {
    const newStateBoard = produce(board, draft => {
      draft[index].value = true; // !draft[index].value;
      draft[index].color = color;
    });
    setBoard(newStateBoard);
    updatePiece(newStateBoard);
  }

  return (
    <AppStyled>
      <TitleContainer>
        <IconButton onClick={() => setRoom(null)}>
          <BackIcon />
        </IconButton>
        <Typography variant="h2" align="center" color="primary">
          Board game
        </Typography>
      </TitleContainer>
      <BoardStyled size={Math.sqrt(board.length)}>
        {boardState.map((item, index) => (
          <Piece
            color={item.color}
            selectColor={color}
            selected={item.value}
            key={index}
            onClick={() => togglePiece(index)}
          />
        ))}
      </BoardStyled>
    </AppStyled>
  );
}

export default Board;
