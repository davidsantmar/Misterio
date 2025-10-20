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
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [buttonPress, setButtonPress] = useState(null);
  const [showcards, setShowcards] = useState(null);
  const [hidecards, setHidecards] = useState(null);
  const [cardsDeployed, setCardsDeployed] = useState(null);
 // Cargar sonidos una vez al montar el componente
  useEffect(() => {
    const loadSounds = async () => {
      try {
        console.log("Cargando sonidos...");
        
        // Cargar leak
        const { sound: leakSound } = await Audio.Sound.createAsync(
          require("../assets/sounds/leak.mp3"),
          { shouldPlay: true } // Reproducir inmediatamente después de cargar
        );
        setLeak(leakSound);
        console.log("Leak cargado y reproduciéndose");

        // Cargar rats (en secuencia para evitar conflictos)
        const { sound: ratsSound } = await Audio.Sound.createAsync(
          require("../assets/sounds/rats.mp3"),
          { shouldPlay: true } // Reproducir inmediatamente después de cargar
        );
        setRats(ratsSound);
        console.log("Rats cargado y reproduciéndose");
        
        setSoundsLoaded(true);
      } catch (error) {
        console.error("Error cargando sonidos:", error);
      }
    };

    loadSounds();

    // Cleanup al desmontar
    return () => {
      const unloadSounds = async () => {
        if (leak) {
          await leak.unloadAsync();
          console.log("Leak liberado");
        }
        if (rats) {
          await rats.unloadAsync();
          console.log("Rats liberado");
        }
        if (buttonPress) {
          console.log("Liberando buttonPress");
          buttonPress.unloadAsync();
        }
        if (hidecards) {
          console.log("Liberando hidecards");
          hidecards.unloadAsync();
        }
        if (showcards) {
          console.log("Liberando showcards");
          showcards.unloadAsync();
        }
      };
      unloadSounds();
    };
  }, []); // Solo se ejecuta una vez al montar

  // Configurar modo de audio
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }, []);

  // Opcional: Reproducir sonidos cuando se carguen completamente
  useEffect(() => {
    if (soundsLoaded && leak && rats) {
      // Los sonidos ya se reprodujeron al cargar, pero puedes hacer replay si es necesario
      console.log("Todos los sonidos listos");
    }
  }, [soundsLoaded, leak, rats]);

  const handleShowCardsPress = () => {
    !cardsDeployed ? playShowcards() : playHidecards();
    setOpacityBack(opacityBack === 1 ? 0.5 : 1);
  };
  
  const storeInitialPosition = async (position) => {
    try {
        await AsyncStorage.setItem('position', position);
    } catch (e) {
        console.log('error saving data');
    }
  };
  async function playShowcards() {
        setCardsDeployed(true);
        console.log("Cargando showcards");
        try {
          if (showcards) {
            // Si el sonido ya está cargado, reutilízalo
            console.log("Reproduciendo showcards existente");
            await showcards.replayAsync();
            return;
          }
    
          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/showcards.mp3")
          );
          setShowcards(sound);
          console.log("Reproduciendo showcards");
          await sound.playAsync();
        } catch (error) {
          console.error("Error al reproducir showcards:", error);
        }
      }
      async function playHidecards() {
        setCardsDeployed(false);
        console.log("Cargando hidecards");
        try {
          if (hidecards) {
            // Si el sonido ya está cargado, reutilízalo
            console.log("Reproduciendo hidecards existente");
            await hidecards.replayAsync();
            return;
          }
    
          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/hidecards.mp3")
          );
          setHidecards(sound);
          console.log("Reproduciendo hidecards");
          await sound.playAsync();
        } catch (error) {
          console.error("Error al reproducir hidecards:", error);
        }
      }
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
   const toDice = async (floor) => {
    playButtonPress();
    try {
      // Detener y liberar
      if (leak) {
        await leak.stopAsync();
        await leak.unloadAsync();
        setLeak(null);
      }
      if (rats) {
        await rats.stopAsync();
        await rats.unloadAsync();
        setRats(null);
      }
    } catch (error) {
      console.error("Error liberando sonidos:", error);
    }
    
    storeInitialPosition('0');
    router.push({ 
      pathname: '/dice',
      params: { floor }
    });
  };
    return (
      <>
        <ShowCardsButton onPress={handleShowCardsPress} />
        <ImageBackground style={[styles.container, { opacity: opacityBack }]} source={require ('../assets/images/entrance.png')} resizeMode="cover">
          <View style={styles.instructions}>
              <Text style={styles.button_text}>A dónde te diriges?</Text>
          </View>
          <View style={styles.buttons_container}>
            <Pressable style={styles.first_floor_container} onPress={()=> toDice('firstFloor')}>
              <Text style={styles.button_text_title}>Primer piso</Text>
              <Text style={styles.button_text}>Laboratorio</Text>
              <Text style={styles.button_text}>Salón</Text>
              <Text style={styles.button_text}>Biblioteca</Text>
              <Text style={styles.button_text}>Alcoba</Text>
            </Pressable>
            <Pressable style={styles.ground_container} onPress={()=> toDice('ground')}>
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
    marginTop: 180,
    width: '90%',
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  buttons_container: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 120,
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