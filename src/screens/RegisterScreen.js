import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import firebase from '../config/firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseconfig';  // Certifique-se de importar corretamente

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Criar documento no Firestore com o tipo de usuário como "cliente
      await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "cliente"
    });

      alert('Cliente registrado com sucesso!');
      navigation.navigate('Login'); // Redireciona após o sucesso
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View>
      <Text>Register</Text>
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
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
