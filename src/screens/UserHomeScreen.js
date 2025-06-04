import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';

const UserHomeScreen = ({ navigation }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const unsubscribe = FirebaseFirestore()
      .collection('availableSlots')
      .onSnapshot(snapshot => {
        const fetchedSlots = snapshot.docs.map(doc => doc.data());
        setSlots(fetchedSlots);
      });

    return unsubscribe;
  }, []);

  const handleBook = (slot) => {
    // Implementar lógica para reservar o slot
    alert(`You booked ${slot.time}`);
  };

  return (
    <View>
      <Text>User's Dashboard</Text>
      <Text>Available Slots:</Text>
      {slots.map((slot, index) => (
        <View key={index}>
          <Text>{slot.time}</Text>
          <Button title="Book Now" onPress={() => handleBook(slot)} />
        </View>
      ))}
    </View>
  );
};

export default UserHomeScreen;
