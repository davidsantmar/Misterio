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
  const [turn, setTurn] = useState('player');
  const [player, setPlayer] = useState('playerData');
 // Cargar sonidos una vez al montar el componente
  useEffect(() => {
    const loadSounds = async () => {
      try {        
        // Cargar leak
        const { sound: leakSound } = await Audio.Sound.createAsync(
          require("../assets/sounds/leak.mp3"),
          { shouldPlay: true } // Reproducir inmediatamente después de cargar
        );
        setLeak(leakSound);
        // Cargar rats (en secuencia para evitar conflictos)
        const { sound: ratsSound } = await Audio.Sound.createAsync(
          require("../assets/sounds/rats.mp3"),
          { shouldPlay: true } // Reproducir inmediatamente después de cargar
        );
        setRats(ratsSound);        
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
        }
        if (rats) {
          await rats.unloadAsync();;
        }
        if (buttonPress) {
          buttonPress.unloadAsync();
        }
        if (hidecards) {
          hidecards.unloadAsync();
        }
        if (showcards) {
          showcards.unloadAsync();
        }
      };
      unloadSounds();
    };
  }, []); // Solo se ejecuta una vez al montar  
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    setTurn('player')
    
  }, []);
  useEffect(() => {
    if (soundsLoaded && leak && rats) {
      ("Todos los sonidos listos");
    }
  }, [soundsLoaded, leak, rats]);
  const handleShowCardsPress = () => {
    !cardsDeployed ? playShowcards() : playHidecards();
    setOpacityBack(opacityBack === 1 ? 0.5 : 1);
  };
  const storeTurn = async (turn) => {
    try {
        await AsyncStorage.setItem('turn', turn);
    } catch (e) {
        console.log('error saving turn');
    }
  };
  async function playShowcards() {
    setCardsDeployed(true);
    try {
      if (showcards) {
        await showcards.replayAsync();
        return;
      }
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/showcards.mp3")
      );
      setShowcards(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir showcards:", error);
    }
  }
  async function playHidecards() {
    setCardsDeployed(false);
    try {
      if (hidecards) {
        await hidecards.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/hidecards.mp3")
      );
      setHidecards(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir hidecards:", error);
    }
  }
   async function playButtonPress() {
    try {
      if (buttonPress) {
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
  const storePlayerFloor = async (floor) => { //se guardan las cartas de la computadora
    try {
      const storedData = await AsyncStorage.getItem("playerData");
      const currentData = storedData ? JSON.parse(storedData) : null;
      if (!currentData) return;

      const updatedPlayerData = { ...currentData, floor: floor };
      await AsyncStorage.setItem(
        "playerData",
        JSON.stringify(updatedPlayerData)
      );
    } catch (e) {
      console.log("❌ Error updating data:", e);
    }
  };
  const toDice = async (floor) => {
    storeTurn('player');
    storePlayerFloor(floor);
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
    
    router.push({ 
      pathname: '/dice',
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