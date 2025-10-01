import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import { CardIntoEnvelope } from '../components/CardIntoEnvelope';
import { useRouter } from 'expo-router';

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
    const [loaded, error] = useFonts({  //to load and use font
        'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'), 
    })
  
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
    const timer1 = setTimeout(() => {
        setCardReverseText('TE');
      }, 3000);
      const timer2 = setTimeout(() => {
        setCardReverseText('RIO');
      }, 6000);
      const timer3 = setTimeout(() => {
        router.push({
          pathname: "/entry",
        });
      }, 8000);
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
  }
});

