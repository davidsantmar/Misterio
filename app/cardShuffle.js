import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import { CardIntoEnvelope } from '../components/CardIntoEnvelope';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from 'expo-router/build/global-state/router-store';

const { width } = Dimensions.get('window');

export default function CardShuffle() {
    const router = useRouter();
  const [cardReverseText, setCardReverseText] = useState('MIS');
  // Crear referencias para las animaciones de cada carta
  const card1Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const card2Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const card3Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const card4Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const card5Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const card6Anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const rotation1 = useRef(new Animated.Value(0)).current;
  const rotation2 = useRef(new Animated.Value(0)).current;
  const rotation3 = useRef(new Animated.Value(0)).current;
  const [envelope, setEnvelope] = useState([]);
  const [misCards, setMisCards] = useState(['Mr Hyde', 'Dracula', 'Frankenstein', 'Hombre lobo', 'Fantasma', 'Momia']);
  const [teCards, setTeCards] = useState(['Conde', 'Condesa', 'Jardinero', 'Ama de llaves', 'Mayordomo', 'Doncella']);
  const [rioCards, setRioCards] = useState(['Laboratorio', 'Salón', 'Biblioteca', 'Alcoba', 'Cocheras', 'Vestíbulo', 'Panteón', 'Bodega']);
    const [loaded, error] = useFonts({  //to load and use font
        'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'), 
    })
  const storeEnvelope = async (envelope) => {
  try {
    const stringEnvelope = JSON.stringify(envelope); // Convertir el array a string
    await AsyncStorage.setItem('envelope', stringEnvelope); // Guardar en AsyncStorage
    console.log('Array guardado exitosamente');
  } catch (error) {
    console.error('Error al guardar el array:', error);
  }
};
const playersShuffle = async () => {
  // Verificar que los arreglos existan y no estén vacíos
  if (!misCards?.length || !teCards?.length || !rioCards?.length) {
    console.error('Uno o más arreglos de cartas están vacíos o no definidos');
    return;
  }

  const playerCards = [];
  const computerCards = [];

  // Repartir 2 cartas de misCards al jugador
  for (let i = 0; i < 2; i++) {
    if (misCards.length === 0) break; // Evitar errores si no hay más cartas
    const randomIndex = Math.floor(Math.random() * misCards.length);
    playerCards.push(misCards[randomIndex]);
    misCards.splice(randomIndex, 1); // Eliminar la carta seleccionada
  }

  // Repartir 3 cartas de misCards a la computadora
  for (let i = 0; i < 3; i++) {
    if (misCards.length === 0) break;
    const randomIndex = Math.floor(Math.random() * misCards.length);
    computerCards.push(misCards[randomIndex]);
    misCards.splice(randomIndex, 1);
  }

  // Repartir 3 cartas de teCards al jugador
  for (let i = 0; i < 3; i++) {
    if (teCards.length === 0) break;
    const randomIndex = Math.floor(Math.random() * teCards.length);
    playerCards.push(teCards[randomIndex]);
    teCards.splice(randomIndex, 1);
  }

  // Repartir 2 cartas de teCards a la computadora
  for (let i = 0; i < 2; i++) {
    if (teCards.length === 0) break;
    const randomIndex = Math.floor(Math.random() * teCards.length);
    computerCards.push(teCards[randomIndex]);
    teCards.splice(randomIndex, 1);
  }

  // Repartir 3 cartas de rioCards al jugador
  for (let i = 0; i < 3; i++) {
    if (rioCards.length === 0) break;
    const randomIndex = Math.floor(Math.random() * rioCards.length);
    playerCards.push(rioCards[randomIndex]);
    rioCards.splice(randomIndex, 1);
  }

  // Repartir 2 cartas de rioCards a la computadora
  for (let i = 0; i < 4; i++) {
    if (rioCards.length === 0) break;
    const randomIndex = Math.floor(Math.random() * rioCards.length);
    computerCards.push(rioCards[randomIndex]);
    rioCards.splice(randomIndex, 1);
  }
// Guardar en AsyncStorage
  try {
    await AsyncStorage.setItem('playerCards', JSON.stringify(playerCards));
    await AsyncStorage.setItem('computerCards', JSON.stringify(computerCards));
    console.log('Cartas guardadas en AsyncStorage');
  } catch (error) {
    console.error('Error al guardar en AsyncStorage:', error);
  }
  // Imprimir resultados
  console.log('Player cards:', playerCards);
  console.log('Computer cards:', computerCards);
  console.log('Envelope:', envelope);  
};
  useEffect(() => {
    // Función para animar una carta
    const animateCard = (cardAnim, rotation, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cardAnim, {
            toValue: { x: width * 0.3, y: -20 },
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(cardAnim, {
            toValue: { x: -width * 0.3, y: 20 },
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: -15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(cardAnim, {
            toValue: { x: 0, y: 0 },
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Iniciar animaciones con diferentes retrasos para un efecto escalonado
    animateCard(card1Anim, rotation1, 0);
    animateCard(card2Anim, rotation2, 200);
    animateCard(card3Anim, rotation3, 400);
    animateCard(card4Anim, rotation3, 600);
    animateCard(card5Anim, rotation2, 800);
    animateCard(card6Anim, rotation1, 1000);    
    const misCard = Math.floor(Math.random() * misCards.length); // Generar número aleatorio
    envelope.push(misCards[misCard]); // Agregar el número al arreglo
    misCards.splice(misCard, 1);
    const timer1 = setTimeout(() => {
        setCardReverseText('TE');
        const teCard = Math.floor(Math.random() * teCards.length); // Generar número aleatorio
        envelope.push(teCards[teCard]);
        teCards.splice(teCard, 1);
      }, 3000);
      const timer2 = setTimeout(() => {
        setCardReverseText('RIO');
        const rioCard = Math.floor(Math.random() * rioCards.length); // Generar número aleatorio
        envelope.push(rioCards[rioCard]);
        rioCards.splice(rioCard, 1);
      }, 6000);
      const timer3 = setTimeout(() => {
        router.push({
          pathname: "/entry",
          //params: { envelope: JSON.stringify(envelope) }
        });
        storeEnvelope(envelope);
        playersShuffle();
      }, 8000);
     
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
  }, []);

  // Interpolación para rotación en grados
  const rotation1Deg = rotation1.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  const rotation2Deg = rotation2.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  const rotation3Deg = rotation3.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground style={styles.container} source={require("../assets/images/table-back.png")}>
        <CardIntoEnvelope text={cardReverseText} />
        
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX: card1Anim.x }, { translateY: card1Anim.y }, { rotate: rotation1Deg }] },
        ]}
      >
        <Text style={styles.textCard}>{cardReverseText}</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX: card2Anim.x }, { translateY: card2Anim.y }, { rotate: rotation2Deg }] },
        ]}
      >
        <Text style={styles.textCard}>{cardReverseText}</Text>
    </Animated.View>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX: card3Anim.x }, { translateY: card3Anim.y }, { rotate: rotation3Deg }] },
        ]}
      >
        <Text style={styles.textCard}>{cardReverseText}</Text>
    </Animated.View>
    <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX: card4Anim.x }, { translateY: card4Anim.y }, { rotate: rotation3Deg }] },
        ]}
      >
        <Text style={styles.textCard}>{cardReverseText}</Text>
    </Animated.View>
    <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX: card5Anim.x }, { translateY: card5Anim.y }, { rotate: rotation2Deg }] },
        ]}
      >
        <Text style={styles.textCard}>{cardReverseText}</Text>
    </Animated.View>
    <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX: card6Anim.x }, { translateY: card6Anim.y }, { rotate: rotation1Deg }] },
        ]}
      >
        <Text style={styles.textCard}>{cardReverseText}</Text>
    </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  textCard: { 
    fontSize: 32,
    fontFamily: 'Creepster-Regular',
    color: 'white',
  },
  card: {
    width: 100,
    height: 150,
    backgroundColor: 'black',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'red',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 180
  }
});

