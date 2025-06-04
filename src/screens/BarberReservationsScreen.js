import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator, Card, Text, Title, Paragraph } from 'react-native-paper';
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
      <View style={styles.centered}>
        <ActivityIndicator animating size="large" color="#6200ee" />
        <Text style={{ marginTop: 12 }}>Carregando reservas...</Text>
      </View>
    );
  }

  if (reservations.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>Nenhuma reserva encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Reservas dos Clientes</Title>
      {reservations.map(res => (
        <Card key={res.id} style={styles.card} elevation={3}>
          <Card.Content>
            <Title style={styles.clientName}>{res.reservedByName || 'Sem nome'}</Title>
            <Paragraph>📅 Data: {res.date}</Paragraph>
            <Paragraph>⏰ Horário: {res.time}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BarberReservationsScreen;
