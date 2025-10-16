import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text, Image, ImageBackground } from 'react-native';
import { Audio } from "expo-av";

const { width, height } = Dimensions.get('window');

export function CardIntoEnvelope({ text }) {
  const cardAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [shuffling, setShuffling] = useState(null);

  useEffect(() => {
    Animated.sequence([
      // 1️⃣ La carta sube un poco
      Animated.timing(cardAnim, {
        toValue: { x: 0, y: -120 },
        duration: 800,
        useNativeDriver: true,
      }),
      // 2️⃣ Se mueve hacia abajo (posición del sobre)
      Animated.timing(cardAnim, {
        toValue: { x: 0, y: height * 0.22},
        duration: 1000,
        useNativeDriver: true,
      }),
      // 3️⃣ Entra en el sobre
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    shufflingSound();
  }, [text]);
  useEffect(() => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
  
      // Liberación de sonidos al desmontar el componente
      return () => {
        if (shuffling) {
          console.log("Liberando shuffling");
          shuffling.unloadAsync();
        }
      };
    },[shuffling]);
  async function shufflingSound() {
        console.log("Cargando shuffling");
        try {
          if (shuffling) {
            // Si el sonido ya está cargado, reutilízalo
            console.log("Reproduciendo shuffling existente");
            await shuffling.replayAsync();
            return;
          }
    
          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/shuffling-cards.mp3")
          );
          setShuffling(sound);
          console.log("Reproduciendo shuffling");
          await sound.playAsync();
        } catch (error) {
          console.error("Error al reproducir shuffling:", error);
        }
      }
  return (
    <View style={styles.container}>
      {/* Carta animada */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: cardAnim.x },
              { translateY: cardAnim.y },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Text style={styles.textCard}>{text}</Text>
      </Animated.View>
      <ImageBackground style={styles.envelope} source={require("../assets/images/envelope.png")} resizeMode="cover">
        <View style={{ transform: [{ rotate: '-35deg' }] }}>
          <Text style={styles.textEnvelope}>MISTERIO</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 100,
    height: 150,
    backgroundColor: 'black',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'red',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  textCard: {
    fontSize: 24,
    fontFamily: 'Creepster-Regular',
    color: 'white',
  },
  envelope: {
    position: 'absolute',
    bottom: height * 0.2,
    width: 250,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEnvelope: {
    fontSize: 35,
    fontFamily: 'Creepster-Regular',
    color: 'black',
  }
});
