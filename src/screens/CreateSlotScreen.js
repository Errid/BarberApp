<<<<<<< HEAD
// src/screens/CreateSlotScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from '../config/firebaseconfig'; // Firestore

export default function CreateSlotScreen() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleCreateSlot = async () => {
    if (!date || !time) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await db.collection('slots').add({
        date: date,
        time: time,
        available: true
      });
      Alert.alert('Sucesso', 'Horário adicionado!');
      setDate('');
      setTime('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar o slot');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Horário Disponível</Text>

      <TextInput
        placeholder="Data (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Hora (ex: 14:00)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />

      <Button title="Criar Horário" onPress={handleCreateSlot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5
  }
});
=======
// src/screens/CreateSlotScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from '../config/firebaseconfig'; // Firestore

export default function CreateSlotScreen() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleCreateSlot = async () => {
    if (!date || !time) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await db.collection('slots').add({
        date: date,
        time: time,
        available: true
      });
      Alert.alert('Sucesso', 'Horário adicionado!');
      setDate('');
      setTime('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar o slot');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Horário Disponível</Text>

      <TextInput
        placeholder="Data (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Hora (ex: 14:00)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />

      <Button title="Criar Horário" onPress={handleCreateSlot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5
  }
});
>>>>>>> master
