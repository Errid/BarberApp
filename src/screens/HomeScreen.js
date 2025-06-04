import React, { useState, useEffect } from 'react';
import { View, Alert, Modal, StyleSheet, FlatList } from 'react-native';
import { Text, Button, TextInput, Card, Title } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import firebase from '../config/firebaseconfig';
import { useNavigation } from '@react-navigation/native';

const ClientReservationScreen = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const navigation = useNavigation();
  const userId = firebase.auth().currentUser?.uid;

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      const db = firebase.firestore();
      const snapshot = await db.collection('slots').where('available', '==', true).get();
      const slots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAvailableSlots(slots);
    };

    fetchAvailableSlots();
  }, []);

  const markedDates = {};
  availableSlots.forEach(slot => {
    markedDates[slot.date] = { marked: true, dotColor: 'blue' };
  });

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Erro', 'Selecione um dia e horário');
      return;
    }

    setNameModalVisible(true);
  };

  const confirmReservation = async () => {
    if (!userNameInput.trim()) {
      Alert.alert('Erro', 'Digite seu nome');
      return;
    }

    const db = firebase.firestore();
    const slot = availableSlots.find(s => s.date === selectedDate && s.time === selectedTime);
    if (!slot) {
      Alert.alert('Erro', 'Horário não encontrado.');
      return;
    }

    try {
      await db.collection('slots').doc(slot.id).update({
        available: false,
        reservedBy: userId,
        reservedByName: userNameInput.trim(),
      });

      // Atualiza slots disponíveis localmente
      const updatedSlots = availableSlots.filter(s => s.id !== slot.id);
      setAvailableSlots(updatedSlots);

      Alert.alert('Reserva confirmada', `Você reservou ${selectedTime} em ${selectedDate}`);
      setSelectedTime('');
      setUserNameInput('');
      setNameModalVisible(false);
    } catch (error) {
      console.error('Erro ao reservar horário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer a reserva.');
    }
  };

  const formatDateBR = (dateString) => {
    const [year,month,day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Marcar horário</Title>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Reservations')}
        style={styles.viewReservationsButton}
      >
        Minhas Reservas
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Catalogo')}
        style={styles.viewReservationsButton}
      >
        Catálogo
      </Button>

      <Calendar
        locale={'pt-br'}
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, marked: true, selectedColor: '#00adf5' }
        }}
        style={styles.calendar}
      />

      {selectedDate && (
        <>
          <Title style={styles.subtitle}>Horários para {formatDateBR(selectedDate)}</Title>
          <FlatList
            horizontal
            data={availableSlots.filter(slot => slot.date === selectedDate)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <Card
                style={[
                  styles.timeCard,
                  selectedTime === item.time && styles.selectedTimeCard
                ]}
                onPress={() => setSelectedTime(item.time)}
              >
                <Card.Content>
                  <Text>{item.time}</Text>
                </Card.Content>
              </Card>
            )}
          />
          <Button
            mode="contained"
            onPress={handleBooking}
            style={styles.confirmButton}
            disabled={!selectedTime}
          >
            Confirmar Reserva
          </Button>
        </>
      )}

      {/* Modal para nome */}
      <Modal visible={nameModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Title style={{ marginBottom: 10 }}>Digite seu nome</Title>
            <TextInput
              label="Nome"
              value={userNameInput}
              onChangeText={setUserNameInput}
              mode="outlined"
              style={{ marginBottom: 20 }}
            />
            <Button mode="contained" onPress={confirmReservation}>
              Confirmar
            </Button>
            <Button mode="text" onPress={() => setNameModalVisible(false)} textColor="red">
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClientReservationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#333333',
    fontWeight: '600',
  },
  viewReservationsButton: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  calendar: {
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  timeCard: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTimeCard: {
    backgroundColor: '#2196F3',
  },
  confirmButton: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
});

