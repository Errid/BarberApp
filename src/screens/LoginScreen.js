import React, { useState } from 'react';
import { View, TextInput, Button, Text,StyleSheet } from 'react-native';
import firebase from '../config/firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseconfig';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.data()?.role;

    if (role === 'barbeiro') {
      navigation.navigate('AddSlot'); // tela do barbeiro
    } else {
      navigation.navigate('Home'); // tela do cliente
    }

  } catch (error) {
    setErrorMessage(error.message);
  }
};

  return (
    <View>
      <Text>Login</Text>
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <TextInput 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;
