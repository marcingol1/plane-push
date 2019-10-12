import React, { useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider, StylesProvider } from "@material-ui/styles";
import { purple, indigo } from "@material-ui/core/colors";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Board from "./components/board";
import Login from "./components/login";
import Server from "./components/server";

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: purple,
      secondary: indigo
    }
  });
  const [authorized, setAuthorized] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          {!authorized && <Login setAuthorized={setAuthorized} />}
          {authorized && (
            <Router>
              <Switch>
                <Route path="/game">
                  <Board />
                </Route>
                <Route path="/">
                  <Server />
                </Route>
              </Switch>
            </Router>
          )}
        </StylesProvider>
      </StyledThemeProvider>
    </ThemeProvider>
  );
}

export default App;
