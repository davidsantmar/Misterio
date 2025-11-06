import { StyleSheet, Text, View, ImageBackground, Pressable} from 'react-native';
import { useFonts } from 'expo-font';
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
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
  const [playerChoose, setPlayerChoose] = useState('Detective Nely');
  const router = useRouter();
  useEffect(() => {
    playStart();
  }, [])
  useEffect(() => {
    // Cambia el GIF por una imagen estática después de X milisegundos (duración aproximada del GIF)
    const timer = setTimeout(() => {
      if (playerChoose === 'Detective Nely'){
        setGifSource(require('../assets/images/Nely.png')); // Imagen estática (último cuadro del GIF)
      }else if (playerChoose === 'Inspector David'){
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
          start.unloadAsync();
        }
        if (buttonPress) {
          buttonPress.unloadAsync();
        }
      };
    },[buttonPress, start]);
    async function playStart() {
      try {
        if (start) {
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

  const storeComputerData = async (name) => { //se crea el computer data
    const computerData = { id: 1, name: name, position: 0, floor: '', computerCards: [], discardedCards: [], roomToGo: '' };
    await AsyncStorage.setItem("computerData", JSON.stringify(computerData));
  };
  const storePlayerData = async (name) => {
    const playerData = { id: 0, name: name, position: 0, floor: '', playerCards: [], discardedCards: []  };
    await AsyncStorage.setItem("playerData", JSON.stringify(playerData));
  };
  const storeTurn = async (turn) => {
    await AsyncStorage.setItem("turn", turn);
  };
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
  const toEntry = () => {
    storeTurn('player');
    storePlayerData(playerChoose)
    if (playerChoose === 'Detective Nely'){
      storeComputerData('Inspector David')
    }else{
      storeComputerData('Detective Nely');
    }
    playButtonPress();
    router.push({
        pathname: '/cardShuffle',
      });
  }
  const toAnotherPlayer = () => {
    playButtonPress();
   setPlayerChoose(prevPlayer => 
    prevPlayer === 'Detective Nely' ? 'Inspector David' : 'Detective Nely'
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