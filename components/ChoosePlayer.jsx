import { StyleSheet, Text, View, ImageBackground, Pressable} from 'react-native';
import { useFonts } from 'expo-font';
import { Audio } from "expo-av";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ChoosePlayer() {
  const [gifSource, setGifSource] = useState(require('../assets/gifs/Intro_Nely.gif'));
  const [buttonPress, setButtonPress] = useState(null);
  const [start, setStart] = useState(null);
  const [playerCharge, setPlayerCharge] = useState('Detective Nely')
  const [loaded, error] = useFonts({  //to load and use font
        'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'), 
    });
  const [playerChoose, setPlayerChoose] = useState('Nely');
  const router = useRouter();
  const videoRef = useRef(null); // Referencia para el componente Video
  useEffect(() => {
    playStart();
  }, [])
  useEffect(() => {
    // Cambia el GIF por una imagen estática después de X milisegundos (duración aproximada del GIF)
    const timer = setTimeout(() => {
      if (playerChoose === 'Nely'){
        setGifSource(require('../assets/images/Nely.png')); // Imagen estática (último cuadro del GIF)
      }else if (playerChoose === 'David'){
        setGifSource(require('../assets/images/David.png'));
      }
    }, 5500); // Ajusta el tiempo según la duración del GIF
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [playerChoose]);
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
          console.log("Liberando start");
          start.unloadAsync();
        }
        if (buttonPress) {
          console.log("Liberando buttonPress");
          buttonPress.unloadAsync();
        }
      };
    },[buttonPress, start]);
    async function playStart() {
      console.log("Cargando start");
      try {
        if (start) {
          // Si el sonido ya está cargado, reutilízalo
          console.log("Reproduciendo start existente");
          await start.replayAsync();
          return;
        }
  
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/start.mp3")
        );
        setStart(sound);
        console.log("Reproduciendo start");
        await sound.playAsync();
      } catch (error) {
        console.error("Error al reproducir start:", error);
      }
    }
  const storePlayer = async (player) => {
    try {
      await AsyncStorage.setItem('player', player); // Guardar en AsyncStorage
      console.log('Player guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el player:', error);
    }
  };
  async function playButtonPress() {
      console.log("Cargando buttonPress");
      try {
        if (buttonPress) {
          // Si el sonido ya está cargado, reutilízalo
          console.log("Reproduciendo buttonPress existente");
          await buttonPress.replayAsync();
          return;
        }
  
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/button-press.mp3")
        );
        setButtonPress(sound);
        console.log("Reproduciendo buttonPress");
        await sound.playAsync();
      } catch (error) {
        console.error("Error al reproducir buttonPress:", error);
      }
    }
    const toEntry = () => {
      storePlayer(playerChoose);
      playButtonPress();
      router.push({
          pathname: '/cardShuffle',
        });
    }
  const toAnotherPlayer = () => {
    playButtonPress();
   setPlayerChoose(prevPlayer => 
    prevPlayer === 'Nely' ? 'David' : 'Nely'
   )
   setGifSource(prevGifSource =>
    prevGifSource === require('../assets/gifs/Intro_Nely.gif') ? require('../assets/gifs/Intro_David.gif') : require('../assets/gifs/Intro_Nely.gif')
   )
   setPlayerCharge(prevCharge => 
    prevCharge === 'Detective Nely' ? 'Inspector David' : 'Detective Nely' 
   )
  }
    return (
      <>
        <ImageBackground
          source={gifSource} 
          resizeMode="cover" 
          style={styles.container}
        >
        <View style={styles.buttons_container}>
          <Pressable style={styles.button_container} onPress={toEntry}>
            <Text style={styles.button_text}>{playerCharge}</Text>
          </Pressable>
          <Pressable style={styles.other_player_container} onPress={toAnotherPlayer}>
            <Text style={styles.button_text}>Otro personaje</Text>
          </Pressable>
        </View> 
        </ImageBackground>
      </>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  buttons_container: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: 100,
    width: '90%'
  },
  other_player_container: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },
  button_container: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 16
  }
});