import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import firebase from '../config/firebaseconfig';

const MyReservationsScreen = () => {
  const [myReservations, setMyReservations] = useState([]);
  const userId = firebase.auth().currentUser?.uid;

  useEffect(() => {
    const fetchMyReservations = async () => {
      const db = firebase.firestore();
      const snapshot = await db
        .collection('slots')
        .where('reservedBy', '==', userId)
        .where('available', '==', false)
        .get();

      const reservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyReservations(reservations);
    };

    fetchMyReservations();
  }, []);

  const cancelReservation = async (slotId) => {
    const db = firebase.firestore();
    try {
      await db.collection('slots').doc(slotId).update({
        available: true,
        reservedBy: null,
      });
      setMyReservations(myReservations.filter(r => r.id !== slotId));
      Alert.alert('Sucesso', 'Reserva cancelada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
      console.error('Erro ao cancelar:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Minhas Reservas
      </Text>

      {myReservations.length === 0 ? (
        <Text style={{ fontStyle: 'italic', color: '#666' }}>
          Você ainda não tem reservas.
        </Text>
      ) : (
        <FlatList
          data={myReservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#f9f9f9',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                {item.date}
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                Horário reservado: {item.time}
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: '#ff4d4d',
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => {
                  Alert.alert(
                    'Cancelar Reserva',
                    'Tem certeza que deseja cancelar esta reserva?',
                    [
                      { text: 'Não', style: 'cancel' },
                      { text: 'Sim', onPress: () => cancelReservation(item.id) },
                    ]
                  );
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default MyReservationsScreen;
