import React, { useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider
} from "styled-components";
import { Typography, createMuiTheme } from "@material-ui/core";
import produce from "immer";
import { ThemeProvider, StylesProvider } from "@material-ui/styles";
import { purple, indigo } from "@material-ui/core/colors";

const AppStyled = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  border: 2px solid ${props => props.theme.palette.primary[500]};
  background-color: ${props => props.theme.palette.primary[600]};
  grid-gap: 2px;
  height: 80vh;
  width: 80vh;
`;

const Piece = styled.div`
  background-color: ${props =>
    props.selected
      ? props.theme.palette.primary.main
      : props.theme.palette.secondary[400]};
  height: 100%;
  &:hover {
    background-color: ${props => props.theme.palette.secondary[600]};
  }
`;

function generatePiece() {
  return {
    value: false
  };
}
function generateBoard(size) {
  return Array.from({ length: size }).map(() =>
    Array.from({ length: size }).map(generatePiece)
  );
}
const size = 12;

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: purple,
      secondary: indigo
    }
  });
  const [board, setBoard] = useState(generateBoard(size));
  console.log(board);

  function togglePiece(_item, row, pieceIndex) {
    const newStateBoard = produce(board, draft => {
      draft[row][pieceIndex].value = !draft[row][pieceIndex].value;
    });
    setBoard(newStateBoard);
  }

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <StyledThemeProvider theme={theme}>
          <AppStyled>
            <Typography variant="h2" align="center">
              Board game
            </Typography>
            <Board>
              {board.map((row, rowIndex) => {
                return row.map((item, pieceIndex) => (
                  <Piece
                    selected={item.value}
                    key={rowIndex + pieceIndex}
                    onClick={() => togglePiece(item, rowIndex, pieceIndex)}
                  />
                ));
              })}
            </Board>
          </AppStyled>
        </StyledThemeProvider>
      </StylesProvider>
    </ThemeProvider>
  );
}

export default App;
