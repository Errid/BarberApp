<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  FlatList,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import {
  Button,
  TextInput,
  Card,
  ActivityIndicator
} from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BarberDashboardScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleCreateSlot = async () => {
    if (!selectedDate || !time) {
      return Alert.alert('Erro', 'Informe data e hora');
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'slots'), {
        date: selectedDate,
        time,
        available: true,
        reservedBy: null,
      });
      Alert.alert('Horário criado!');
      setTime('');
      fetchSlots();
    } catch (error) {
      console.error('Erro ao criar slot:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar o horário');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'slots'));
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSlots(list);
    } catch (error) {
      console.error('Erro ao buscar slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Deletar horário
  const handleDeleteSlot = async (slotId) => {
    Alert.alert('Confirmar exclusão', 'Deseja excluir este horário?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'slots', slotId));
            fetchSlots();
          } catch (error) {
            console.error('Erro ao excluir slot:', error);
            Alert.alert('Erro', 'Não foi possível excluir o horário.');
          }
        },
        style: 'destructive',
      }
    ]);
  };

  const markedDates = {};
  slots.forEach(slot => {
    markedDates[slot.date] = {
      marked: true,
      dotColor: slot.available ? 'green' : 'red'
    };
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleTimeChange = (text) => {
    const onlyNumbers = text.replace(/\D/g, '').slice(0, 4);
    if (onlyNumbers.length === 4) {
      const formatted = `${onlyNumbers.slice(0, 2)}:${onlyNumbers.slice(2)}`;
      setTime(formatted);
    } else {
      setTime(onlyNumbers);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Macarra Trem bala</Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('BarberReservations')}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Ver Reservas
            </Button>

            {/* Botão Catalogo */}
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Catalogo')}
              style={[styles.button, styles.catalogoButton]}
              contentStyle={styles.buttonContent}
            >
              Catalogo
            </Button>
          </View>

          <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, selectedColor: '#6200EE' }
            }}
            theme={{
              selectedDayBackgroundColor: '#6200EE',
              todayTextColor: '#6200EE',
              arrowColor: '#6200EE',
            }}
          />

          <Text style={styles.subtitle}>
            Criar horário para: {selectedDate || 'Nenhuma data selecionada'}
          </Text>

          <TextInput
            label="Horário (ex: 14:00)"
            value={time}
            onChangeText={handleTimeChange}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={5}
          />

          <Button
            mode="contained"
            onPress={handleCreateSlot}
            style={styles.createButton}
            loading={loading}
          >
            Criar Horário
          </Button>

          <Text style={styles.subtitle}>Horários em {selectedDate}:</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#6200EE" />
          ) : (
            slots
              .filter(slot => slot.date === selectedDate)
              .map(item => (
                <Card key={item.id} style={styles.card} elevation={3}>
                  <Card.Content>
                    <Text>{item.time}</Text>
                    <Text style={styles.status}>
                      {item.available
                        ? 'Disponível'
                        : `Reservado por ${item.reservedBy?.email || '---'}`}
                    </Text>

                    {/* Botão de excluir */}
                    <Button
                      mode="text"
                      onPress={() => handleDeleteSlot(item.id)}
                      color="red"
                      compact
                    >
                      Excluir
                    </Button>
                  </Card.Content>
                </Card>
              ))
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 30,
    backgroundColor: '#6200EE',
    flex: 1,
    marginRight: 10,
  },
  catalogoButton: {
    backgroundColor: '#FF5722',
  },
  buttonContent: {
    paddingVertical: 10,
  },
  createButton: {
    borderRadius: 30,
    backgroundColor: '#6200EE',
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  status: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
});

export default BarberDashboardScreen;
=======
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  FlatList,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import {
  Button,
  TextInput,
  Card,
  ActivityIndicator
} from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BarberDashboardScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleCreateSlot = async () => {
    if (!selectedDate || !time) {
      return Alert.alert('Erro', 'Informe data e hora');
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'slots'), {
        date: selectedDate,
        time,
        available: true,
        reservedBy: null,
      });
      Alert.alert('Horário criado!');
      setTime('');
      fetchSlots();
    } catch (error) {
      console.error('Erro ao criar slot:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar o horário');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'slots'));
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSlots(list);
    } catch (error) {
      console.error('Erro ao buscar slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Deletar horário
  const handleDeleteSlot = async (slotId) => {
    Alert.alert('Confirmar exclusão', 'Deseja excluir este horário?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'slots', slotId));
            fetchSlots();
          } catch (error) {
            console.error('Erro ao excluir slot:', error);
            Alert.alert('Erro', 'Não foi possível excluir o horário.');
          }
        },
        style: 'destructive',
      }
    ]);
  };

  const markedDates = {};
  slots.forEach(slot => {
    markedDates[slot.date] = {
      marked: true,
      dotColor: slot.available ? 'green' : 'red'
    };
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleTimeChange = (text) => {
    const onlyNumbers = text.replace(/\D/g, '').slice(0, 4);
    if (onlyNumbers.length === 4) {
      const formatted = `${onlyNumbers.slice(0, 2)}:${onlyNumbers.slice(2)}`;
      setTime(formatted);
    } else {
      setTime(onlyNumbers);
    }
  };
  const formatDateBR = (dateString) => {
    const [year,month,day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Adicionar Horários</Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('BarberReservations')}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Ver Reservas
            </Button>

            {/* Botão Catalogo */}
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Catalogo')}
              style={[styles.button, styles.catalogoButton]}
              contentStyle={styles.buttonContent}
            >
              Catalogo
            </Button>
          </View>

          <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={{
              ...markedDates,
              [selectedDate]: { selected: true, selectedColor: '#6200EE' }
            }}
            theme={{
              selectedDayBackgroundColor: '#6200EE',
              todayTextColor: '#6200EE',
              arrowColor: '#6200EE',
            }}
          />

          <Text style={styles.subtitle}>
            Criar horário para: {formatDateBR(selectedDate) || 'Nenhuma data selecionada'}
          </Text>

          <TextInput
            label="Horário (ex: 14:00)"
            value={time}
            onChangeText={handleTimeChange}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={5}
          />

          <Button
            mode="contained"
            onPress={handleCreateSlot}
            style={styles.createButton}
            loading={loading}
          >
            Criar Horário
          </Button>

          <Text style={styles.subtitle}>Horários em {formatDateBR(selectedDate)}:</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#6200EE" />
          ) : (
            slots
              .filter(slot => slot.date === selectedDate)
              .map(item => (
                <Card key={item.id} style={styles.card} elevation={3}>
                  <Card.Content>
                    <Text>{item.time}</Text>
                    <Text style={styles.status}>
                      {item.available
                        ? 'Disponível'
                        : `Reservado por ${item.reservedBy?.email || '---'}`}
                    </Text>

                    {/* Botão de excluir */}
                    <Button
                      mode="text"
                      onPress={() => handleDeleteSlot(item.id)}
                      color="red"
                      compact
                    >
                      Excluir
                    </Button>
                  </Card.Content>
                </Card>
              ))
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    color: '#000000',
  },
  buttonContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 30,
    backgroundColor: '#2196F3',
    flex: 1,
    marginRight: 10,
  },
  catalogoButton: {
    backgroundColor: '#0D47A1',
  },
  buttonContent: {
    paddingVertical: 10,
  },
  createButton: {
    borderRadius: 30,
    backgroundColor: '#2196F3',
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  status: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
});



export default BarberDashboardScreen;
>>>>>>> master
