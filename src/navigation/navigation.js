// src/navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateSlotScreen from '../screens/CreateSlotScreen';
import AddSlotScreen from '../screens/AddSlotScreen';
import MyReservationsScreen from '../screens/MyReservationsScreen';
import BarberReservationsScreen from '../screens/BarberReservationsScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddSlot" component={AddSlotScreen} />
      <Stack.Screen name="HomeBarber" component={CreateSlotScreen} />
      <Stack.Screen name="Reservations" component={MyReservationsScreen} />
      <Stack.Screen name="BarberReservations" component={BarberReservationsScreen} />
    </Stack.Navigator>
  );
}

