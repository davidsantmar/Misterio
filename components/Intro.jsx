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
    const [openDoor, setOpenDoor] = useState(null);
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
          console.log("Liberando start");
          start.unloadAsync();
        }
        if (openDoor) {
          console.log("Liberando openDoor");
          openDoor.unloadAsync();
        }
      };
    }, [start, openDoor]);
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
    const toLetter = () => {
        playOpenDoor();
        router.push({
            pathname: '/letter',
        });
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
    borderRadius: 10,
    marginTop: 100
  },
  header_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 55,
  },
  button: {
    backgroundColor: 'lightblue',
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