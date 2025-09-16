import { StyleSheet, Text, View, ImageBackground, Pressable} from 'react-native';
import { useFonts } from 'expo-font';
import { Audio } from "expo-av";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";

export function DavidPlayer() {
  const [gifSource, setGifSource] = useState(require('../assets/gifs/Intro_David.gif'));
  const [openDoor, setOpenDoor] = useState(null);
  const [start, setStart] = useState(null);
  const [loaded, error] = useFonts({  //to load and use font
        'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'), 
    });
  const router = useRouter();
  const videoRef = useRef(null); // Referencia para el componente Video
  useEffect(() => {
    playStart();
  }, [])
  useEffect(() => {
    // Cambia el GIF por una imagen estática después de X milisegundos (duración aproximada del GIF)
    const timer = setTimeout(() => {
      setGifSource(require('../assets/images/David.png')); // Imagen estática (último cuadro del GIF)
    }, 5500); // Ajusta el tiempo según la duración del GIF
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, []);
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
        if (openDoor) {
          console.log("Liberando openDoor");
          openDoor.unloadAsync();
        }
      };
    },[openDoor, start]);
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
  async function playOpenDoor() {
      console.log("Cargando openDoor");
      try {
        if (openDoor) {
          // Si el sonido ya está cargado, reutilízalo
          console.log("Reproduciendo openDoor existente");
          await openDoor.replayAsync();
          return;
        }
  
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/open-door.mp3")
        );
        setOpenDoor(sound);
        console.log("Reproduciendo openDoor");
        await sound.playAsync();
      } catch (error) {
        console.error("Error al reproducir openDoor:", error);
      }
    }
  const toAnotherPlayer = () => {
    playOpenDoor();
    router.push({
        pathname: '/womanPlayer',
      });
  }
  const toEntry = () => {
    playOpenDoor();
    router.push({
        pathname: '/entry',
      });
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
            <Text style={styles.button_text}>Seleccionar</Text>
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
    marginTop: 140,
    width: '90%'
  },
  other_player_container: {
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },
  button_container: {
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25
  }
});