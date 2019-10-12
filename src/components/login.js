import React, { useState } from "react";

import * as firebase from "firebase/app";
import "firebase/auth";
import { TextField, Button } from "@material-ui/core";
import styled from "styled-components";

const firebaseConfig = {
  apiKey: "AIzaSyDvh3Px2skXLNZr0NsdAuFbpYakmTSpALo",
  authDomain: "boards-ae397.firebaseapp.com",
  databaseURL: "https://boards-ae397.firebaseio.com",
  projectId: "boards-ae397",
  storageBucket: "",
  messagingSenderId: "1074993487299",
  appId: "1:1074993487299:web:94c21a020e55a34636f176"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const ContainerForm = styled.form`
  display: grid;
  padding-top: 200px;
  grid-auto-flow: row;
  justify-content: center;
  align-items: center;
  height: 30vh;
`;

function Login({ setAuthorized }) {
  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("password");

  function login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res, setAuthorized);
        if (res.user) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function register() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  return (
    <ContainerForm noValidate autoComplete="true">
      <TextField
        label="Login"
        onChange={(_event, value) => setEmail(value)}
        value={email}
      />
      <TextField
        label="Password"
        type="password"
        onChange={(_event, value) => setPassword(value)}
        value={password}
      />
      <Button color="primary" variant="contained" onClick={login}>
        Login
      </Button>
      <Button color="secondary" variant="contained" onClick={register}>
        Register
      </Button>
    </ContainerForm>
  );
}

export default Login;
