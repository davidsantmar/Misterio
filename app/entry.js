import { View, Text, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShowCardsButton } from '../components/ShowCardsButton';
import { useState, useEffect } from 'react';
import { Audio } from "expo-av";

export default function Entry() {
  const router = useRouter();
  const [opacityBack, setOpacityBack] = useState(1);
  const [leak, setLeak] = useState(null);
  const [rats, setRats] = useState(null);
  useEffect(() => {
    playLeak();
    playRats();
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
          if (leak) {
            console.log("Liberando leak");
            leak.unloadAsync();
          }
          if (rats) {
            console.log("Liberando rats");
            rats.unloadAsync();
          }
        };
      }, [leak, rats]);
    async function playLeak() {
        console.log("Cargando leak");
        try {
          if (leak) {
            // Si el sonido ya está cargado, reutilízalo
            console.log("Reproduciendo leak existente");
            await leak.replayAsync();
            return;
          }

          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/leak.mp3")
          );
          setLeak(sound);
          console.log("Reproduciendo leak");
          await sound.playAsync();
        } catch (error) {
          console.error("Error al reproducir leak:", error);
        }
    }
    async function playRats() {
        console.log("Cargando rats");
        try {
          if (rats) {
            // Si el sonido ya está cargado, reutilízalo
            console.log("Reproduciendo rats existente");
            await rats.replayAsync();
            return;
          }

          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/rats.mp3")
          );
          setRats(sound);
          console.log("Reproduciendo rats");
          await sound.playAsync();
        } catch (error) {
          console.error("Error al reproducir rats:", error);
        }
    }
  const handleShowCardsPress = () => {
    setOpacityBack(opacityBack === 1 ? 0.5 : 1);
  };
  
  const storeInitialPosition = async (position) => {
    try {
        await AsyncStorage.setItem('position', position);
    } catch (e) {
        console.log('error saving data');
    }
  };
   const toDice = () => {
      //playOpenDoor();
      storeInitialPosition('0');
      router.push({
          pathname: '/dice',
      });
    }
    return (
      <>
        <ShowCardsButton onPress={handleShowCardsPress} />
        <ImageBackground style={[styles.container, { opacity: opacityBack }]} source={require ('../assets/images/entrance.png')} resizeMode="cover">
          <View style={styles.instructions}>
              <Text style={styles.button_text}>A dónde te diriges?</Text>
          </View>
          <View style={styles.buttons_container}>
            <Pressable style={styles.first_floor_container} onPress={toDice}>
              <Text style={styles.button_text_title}>Primer piso</Text>
              <Text style={styles.button_text}>Laboratorio</Text>
              <Text style={styles.button_text}>Salón</Text>
              <Text style={styles.button_text}>Biblioteca</Text>
              <Text style={styles.button_text}>Alcoba</Text>
            </Pressable>
            <Pressable style={styles.ground_container} onPress={toDice}>
              <Text style={styles.button_text_title}>Planta baja</Text>
              <Text style={styles.button_text}>Cocheras</Text>
              <Text style={styles.button_text}>Vestíbulo</Text>
              <Text style={styles.button_text}>Panteón</Text>
              <Text style={styles.button_text}>Bodega</Text>
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
  instructions: {
    justifyContent: 'center',
    marginTop: 80,
    width: '90%',
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  buttons_container: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 160,
    width: '100%'
  },
  first_floor_container: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },
  ground_container: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },
  button_text_title: {
    fontFamily: 'Creepster-Regular',
    fontSize: 20,
    marginBottom: 10
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 20
  }
})