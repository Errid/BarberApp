<<<<<<< HEAD
import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Importando o KeyboardAwareScrollView
import { Button } from 'react-native-paper'; // Importando Button do react-native-paper
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importando ícones para os botões

const AddCutScreen = ({ navigation }) => {
  const [price, setPrice] = useState('');
  const [cutType, setCutType] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para pegar a imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Função para salvar o novo corte
  const handleAddCut = async () => {
    if (!price || !cutType || !image) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }

    setLoading(true);
    try {
      // Adicionando dados ao Firestore
      await addDoc(collection(db, 'cuts'), {
        price,
        cutType,
        image,
      });
      Alert.alert('Corte adicionado com sucesso!');
      setPrice('');
      setCutType('');
      setImage(null);
      navigation.goBack(); // Volta para a tela de catálogo
    } catch (error) {
      console.error('Erro ao adicionar corte:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o corte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      enableOnAndroid={true} // Habilitar no Android
      extraScrollHeight={20} // Deslocamento adicional para garantir que o conteúdo não fique oculto
    >
      <Text style={styles.title}>Adicionar Corte</Text>

      {/* Campo Tipo de Corte */}
      <TextInput
        placeholder="Tipo de Corte"
        value={cutType}
        onChangeText={setCutType}
        style={styles.input}
      />

      {/* Campo Valor */}
      <TextInput
        placeholder="Valor (ex: 50)"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />

      {/* Selecione a imagem do corte */}
      <Button
        icon="image"
        mode="contained"
        onPress={pickImage}
        style={styles.imageButton}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Selecionar Imagem
      </Button>

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {/* Botão para adicionar corte */}
      <Button
        icon="content-save"
        mode="contained"
        onPress={handleAddCut}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        {loading ? 'Adicionando...' : 'Adicionar Corte'}
      </Button>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  imageButton: {
    marginVertical: 10,
    backgroundColor: '#6D77FF',
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#6D77FF',
    borderRadius: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContent: {
    height: 50,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default AddCutScreen;
=======
import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Importando o KeyboardAwareScrollView
import { Button } from 'react-native-paper'; // Importando Button do react-native-paper
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importando ícones para os botões

const AddCutScreen = ({ navigation }) => {
  const [price, setPrice] = useState('');
  const [cutType, setCutType] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para pegar a imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Função para salvar o novo corte
  const handleAddCut = async () => {
    if (!price || !cutType || !image) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }

    setLoading(true);
    try {
      // Adicionando dados ao Firestore
      await addDoc(collection(db, 'cuts'), {
        price,
        cutType,
        image,
      });
      Alert.alert('Corte adicionado com sucesso!');
      setPrice('');
      setCutType('');
      setImage(null);
      navigation.goBack(); // Volta para a tela de catálogo
    } catch (error) {
      console.error('Erro ao adicionar corte:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o corte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      enableOnAndroid={true} // Habilitar no Android
      extraScrollHeight={20} // Deslocamento adicional para garantir que o conteúdo não fique oculto
    >
      <Text style={styles.title}>Adicionar Corte</Text>

      {/* Campo Tipo de Corte */}
      <TextInput
        placeholder="Tipo de Corte"
        value={cutType}
        onChangeText={setCutType}
        style={styles.input}
      />

      {/* Campo Valor */}
      <TextInput
        placeholder="Valor (ex: 50)"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />

      {/* Selecione a imagem do corte */}
      <Button
        icon="image"
        mode="contained"
        onPress={pickImage}
        style={styles.imageButton}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Selecionar Imagem
      </Button>

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {/* Botão para adicionar corte */}
      <Button
        icon="content-save"
        mode="contained"
        onPress={handleAddCut}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        {loading ? 'Adicionando...' : 'Adicionar Corte'}
      </Button>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  imageButton: {
    marginVertical: 10,
    backgroundColor: '#6D77FF',
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#6D77FF',
    borderRadius: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContent: {
    height: 50,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default AddCutScreen;
>>>>>>> master
