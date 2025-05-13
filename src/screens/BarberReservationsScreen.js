import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import firebase from '../config/firebaseconfig';

const BarberReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const db = firebase.firestore();
        const snapshot = await db
          .collection('slots')
          .where('available', '==', false)
          .orderBy('date')
          .get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReservations(data);
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (reservations.length === 0) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18 }}>Nenhuma reserva encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Reservas dos Clientes</Text>
      <FlatList
        data={reservations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: '#f1f1f1',
            padding: 15,
            borderRadius: 10,
            marginBottom: 10
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.reservedByName || 'Sem nome'}</Text>
            <Text>Data: {item.date}</Text>
            <Text>Horário: {item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default BarberReservationsScreen;
