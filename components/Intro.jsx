import { StyleSheet, Text, View, ImageBackground, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "expo-router";

export function Intro () {
    const pathname = usePathname();
    const [loaded, error] = useFonts({  //to load and use font
        'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'), 
    });
    const [start, setStart] = useState(null);
    const [buttonPress, setButtonPress] = useState(null);
    const router = useRouter();
    useEffect(() => {
       playStart();
    }, []) 
    useEffect(() => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
  
      // Liberación de sonidos al desmontar el componente
      return () => {
        if (start) {
          start.unloadAsync();
        }
        if (buttonPress) {
          buttonPress.unloadAsync();
        }
      };
    }, [start, buttonPress]);
    async function playStart() {
      try {
        if (start) {
          // Si el sonido ya está cargado, reutilízalo
          await start.replayAsync();
          return;
        }
  
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/start.mp3")
        );
        setStart(sound);
        await sound.playAsync();
      } catch (error) {
        console.error("Error al reproducir start:", error);
      }
    }
    async function playButtonPress() {
      try {
        if (buttonPress) {
          // Si el sonido ya está cargado, reutilízalo
          await buttonPress.replayAsync();
          return;
        }
  
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/button-press.mp3")
        );
        setButtonPress(sound);
        await sound.playAsync();
      } catch (error) {
        console.error("Error al reproducir buttonPress:", error);
      }
    }
    const toLetter = () => {
        playButtonPress();
        router.push({
            pathname: '/letter',
        });
    }
    if (!loaded) {
      return null; // o <ActivityIndicator size="large" color="#fff" />
    }
    return (
        <ImageBackground style={styles.container} source={require ('../assets/gifs/Intro.gif')}>
            <View style={styles.header}>
                <Text style={styles.header_text}>Misterio</Text>
            </View>
            <Pressable style={styles.button} onPress={toLetter}>
                <Text style={styles.button_text}>Comenzar</Text>
            </Pressable>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  header: {
    height: 80,
    width: 200,
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  header_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 40,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 500,
    padding: 10
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25
  }
});