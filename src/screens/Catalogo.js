import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { collection, getDocs, doc, getDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { storage, db, auth } from '../config/firebaseconfig'; // Certifique-se de importar o Firebase Storage e Firestore
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Importação para o Firebase Storage
import uuid from 'react-native-uuid'; // Para gerar nomes únicos de arquivos

// Função para fazer o upload da imagem para o Firebase Storage
const uploadImageToStorage = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = `${uuid.v4()}.jpg`; // Nome único para o arquivo
  const storageRef = ref(storage, `cuts/${filename}`); // Caminho onde a imagem será armazenada no Firebase Storage

  // Upload da imagem para o Firebase Storage
  await uploadBytes(storageRef, blob);

  // Obter a URL pública da imagem após o upload
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl; // Retorna a URL pública
};

const CatalogScreen = ({ navigation }) => {
  const [cuts, setCuts] = useState([]);
  const [isBarber, setIsBarber] = useState(false);

  // Buscar os cortes do Firestore
  const fetchCuts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cuts'));
      const cutsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      console.log('Cortes carregados:', cutsList);
      setCuts(cutsList);
    } catch (error) {
      console.error('Erro ao buscar cortes:', error);
    }
  };

  // Verificar se o usuário é barbeiro
  const checkUserRole = async () => {
    const user = auth.currentUser;
    console.log('Usuário atual:', user);

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Dados do usuário:', userData);
          setIsBarber(userData.role === 'barbeiro');
        } else {
          console.log('Documento do usuário não encontrado');
          setIsBarber(false); // Caso não exista o documento, deve garantir que o estado seja falso
        }
      } catch (error) {
        console.error('Erro ao verificar role:', error);
        setIsBarber(false); // Caso haja erro na verificação
      }
    } else {
      console.log('Nenhum usuário autenticado');
      setIsBarber(false); // Garantir que o estado seja falso se o usuário não estiver logado
    }
  };

  // Deletar um corte
  const handleDeleteCut = async (cutId) => {
    Alert.alert(
      'Excluir Corte',
      'Tem certeza que deseja excluir este corte?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'cuts', cutId));
              console.log('Corte excluído com sucesso');
              fetchCuts(); // Atualiza a lista de cortes após a exclusão
            } catch (error) {
              console.error('Erro ao excluir corte:', error);
              Alert.alert('Erro', 'Não foi possível excluir o corte.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Função para adicionar um novo corte (incluindo upload de imagem)
  const handleAddCut = async (cutType, price, imageUri) => {
    if (!cutType || !price || !imageUri) {
      alert('Preencha todos os campos e selecione uma imagem.');
      return;
    }

    const user = auth.currentUser;
    console.log('Usuário autenticado:', user);
    
    if (!user) {
      alert('Você precisa estar logado para adicionar um corte!');
      return;
    }

    try {
      const imageUrl = await uploadImageToStorage(imageUri); // Fazer o upload da imagem e obter a URL pública

      // Adicionar o corte com a URL da imagem
      await addDoc(collection(db, 'cuts'), {
        cutType,
        price,
        image: imageUrl, // URL pública da imagem
        createdBy: user.uid, // Adicionando UID do usuário para futuras verificações de permissão
      });

      alert('Corte adicionado com sucesso!');
      navigation.goBack(); // Voltar para a tela anterior
    } catch (error) {
      console.error('Erro ao adicionar corte:', error);
      alert('Erro ao adicionar corte');
    }
  };

  useEffect(() => {
    fetchCuts();
    checkUserRole(); // Verifica o papel do usuário sempre que a tela for carregada
  }, []);

  const renderCutItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cutType}>{item.cutType}</Text>
        <Text style={styles.price}>R$ {item.price}</Text>
        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
        {isBarber && (
          <TouchableOpacity onPress={() => handleDeleteCut(item.id)}>
            <Button mode="contained" color="#FF6B6B" style={styles.deleteButton}>
              Excluir Corte
            </Button>
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cortes Disponíveis</Text>

      {isBarber && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddCut')}
          style={styles.addButton}
        >
          Adicionar Novo Corte
        </Button>
      )}

      <FlatList
        data={cuts}
        renderItem={renderCutItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    marginVertical: 15,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 3, // Sombra para o card
    padding: 15,
  },
  cutType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 16,
    marginVertical: 5,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  listContainer: {
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 15,
    borderRadius: 8,
  },
  addButton: {
    marginVertical: 20,
    borderRadius: 8,
  },
});

export default CatalogScreen;
