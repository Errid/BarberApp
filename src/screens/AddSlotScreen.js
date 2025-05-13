import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firebase from '../config/firebaseconfig';
import { useNavigation } from '@react-navigation/native';

const ClientReservationScreen = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const navigation = useNavigation();
  const userId = firebase.auth().currentUser?.uid;
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');

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

    setNameModalVisible(true); // Abre o modal para digitar o nome
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

      Alert.alert('Reserva confirmada', `Você reservou ${selectedTime} em ${selectedDate}`);
      setSelectedTime('');
      setUserNameInput('');
      setNameModalVisible(false);
    } catch (error) {
      console.error('Erro ao reservar horário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer a reserva.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Reservar Horário</Text>

      {/* BOTÃO PARA VER MINHAS RESERVAS */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Reservations')}
        style={{
          backgroundColor: '#4CAF50',
          padding: 12,
          borderRadius: 8,
          marginBottom: 15,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Ver Minhas Reservas</Text>
      </TouchableOpacity>

      {/* Calendário com localidade configurada para Português (BR) */}
      <Calendar
        locale={'pt-br'}
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={markedDates}
      />

      {selectedDate && (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
            Horários disponíveis para {selectedDate}
          </Text>
          <FlatList
            data={availableSlots.filter(slot => slot.date === selectedDate)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: selectedTime === item.time ? '#00adf5' : '#eee',
                  margin: 5,
                  minWidth: 80,
                  alignItems: 'center',
                }}
                onPress={() => setSelectedTime(item.time)}
              >
                <Text>{item.time}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Confirmar Reserva" onPress={handleBooking} />
        </>
      )}
    </View>
  );
};

export default ClientReservationScreen;
