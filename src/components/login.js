import React, { useState, useEffect } from 'react';

import * as firebase from 'firebase/app';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDvh3Px2skXLNZr0NsdAuFbpYakmTSpALo',
  authDomain: 'boards-ae397.firebaseapp.com',
  databaseURL: 'https://boards-ae397.firebaseio.com',
  projectId: 'boards-ae397',
  storageBucket: '',
  messagingSenderId: '1074993487299',
  appId: '1:1074993487299:web:94c21a020e55a34636f176'
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

function Login({ setAuthorized, setUserId }) {
  const [auth] = useState(firebase.auth());
  const [email, setEmail] = useState('test1@test.com');
  const [password, setPassword] = useState('password');

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (auth.currentUser && auth.currentUser.email) {
        setAuthorized(true);
        setUserId(auth.currentUser.uid);
      }
    });
  }, [setAuthorized, auth, setUserId]);

  async function login() {
    const res = auth.signInWithEmailAndPassword(email, password);
    if (res.user) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }

  async function register() {
    const res = auth.createUserWithEmailAndPassword(email, password);
    if (res.user) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }

  return (
    <ContainerForm noValidate autoComplete="true">
      <TextField
        label="Login"
        onChange={event => setEmail(event.target.value)}
        value={email}
      />
      <TextField
        label="Password"
        type="password"
        onChange={event => setPassword(event.target.value)}
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
