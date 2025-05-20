import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "cliente"
      });

      alert('Cliente registrado com sucesso!');
      navigation.navigate('Login');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <HelperText type="error" visible={!!errorMessage}>
        {errorMessage}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Registrar
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.loginLink}
      >
        Já tem uma conta? Entrar
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fdfdfd',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 25,
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginLink: {
    marginTop: 16,
  },
});

export default RegisterScreen;
