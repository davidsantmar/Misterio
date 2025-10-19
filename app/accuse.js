import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { ImageBackground, StyleSheet, Text, View, Image, Animated, Pressable } from "react-native";
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from "expo-av";

const killersMap = {
  MrHyde: require('../assets/images/mis/MrHyde.png'),
  Dracula: require('../assets/images/mis/Dracula.png'),
  Frankenstein: require('../assets/images/mis/Frankenstein.png'),
  Hombrelobo: require('../assets/images/mis/Werewolf.png'),
  Fantasma: require('../assets/images/mis/Ghost.png'),
  Momia: require('../assets/images/mis/Mummy.png'),
};
const victimsMap = {
  Conde: require('../assets/images/te/Count.png'),
  Condesa: require('../assets/images/te/Countess.png'),
  Jardinero: require('../assets/images/te/Gardener.png'),
  Amadellaves: require('../assets/images/te/Housekeeper.png'),
  Mayordomo: require('../assets/images/te/Butler.png'),
  Doncella: require('../assets/images/te/Maid.png'),
};
const roomsMap = {
  Laboratorio: require('../assets/images/boardImages/Labo.png'),
  Salon: require('../assets/images/boardImages/Lounge.png'),
  Biblioteca: require('../assets/images/boardImages/Library.png'),
  Alcoba: require('../assets/images/boardImages/Bedroom.png'),
  Cocheras: require('../assets/images/boardImages/garage.png'),
  Vestibulo: require('../assets/images/boardImages/lobby.png'),
  Panteon: require('../assets/images/boardImages/pantheon.png'),
  Bodega: require('../assets/images/boardImages/wine-cellar.png'),
};

export default function Accuse() {
  const assumption = useLocalSearchParams();
  const [assumptionManaged, setAssumptionManaged] = useState([]);
  const [envelopeCards, setEnvelopeCards] = useState([]);
  const [backFlip, setBackFlip] = useState(false);
  const [result, setResult] = useState(null);
  const [suspense, setSuspense] = useState(null);
  const [buttonPress, setButtonPress] = useState(null);
  const [solved, setSolved] = useState(null);
  const [laugh, setLaugh] = useState(null);
  const [loaded, error] = useFonts({  //to load and use font
        'SpecialElite': require('../assets/fonts/SpecialElite-Regular.ttf'), 
    });
  const router = useRouter();

 // Animaciones sello
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  // Animaciones
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Liberación de sonidos al desmontar el componente
    return () => {
      if (suspense) {
        console.log("Liberando suspense");
        suspense.unloadAsync();
      }
      if (buttonPress) {
        console.log("Liberando buttonPress");
        buttonPress.unloadAsync();
      }
       if (solved) {
        console.log("Liberando solved");
        solved.unloadAsync();
      }
      if (laugh) {
        console.log("Liberando laugh");
        laugh.unloadAsync();
      }
    };
  },[suspense, buttonPress, solved, laugh]);
  useEffect(() => {
    if (!assumption) return;

    const newValues = [...Object.values(assumption)];
    if (newValues[0] === 'Mr Hyde') newValues[0] = 'MrHyde';
    if (newValues[0] === 'Hombre lobo') newValues[0] = 'Hombrelobo';
    if (newValues[0] === 'Drácula') newValues[0] = 'Dracula';
    if (newValues[1] === 'Ama de llaves') newValues[1] = 'Amadellaves';
    if (newValues[2] === 'Vestíbulo') newValues[1] = 'Vestibulo';
    if (newValues[2] === 'Panteón') newValues[1] = 'Panteon';
    if (newValues[2] === 'Salón') newValues[1] = 'Salon';
    setAssumptionManaged(newValues);
  }, []);

  // Lanzar animación
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(card1Anim, { toValue: 2, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity1, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(card2Anim, { toValue: 2, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity2, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(card3Anim, { toValue: 2, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity3, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  // Transformaciones de posición/salida
  const translateY1 = card1Anim.interpolate({ inputRange: [0, 1], outputRange: [135, 0] });
  const translateY2 = card2Anim.interpolate({ inputRange: [0, 1], outputRange: [135, 0] });
  const translateY3 = card3Anim.interpolate({ inputRange: [0, 1], outputRange: [135, 0] });

  const rotate1 = card1Anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '0deg'] });
  const rotate2 = card2Anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '0deg'] });
  const rotate3 = card3Anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '0deg'] });
  const [enveloped, setEnveloped] = useState([]);
  const getData = async (data) => {
    try {
      const stringArray = await AsyncStorage.getItem(data); // Obtener la cadena
      if (stringArray !== null) {
        const array = JSON.parse(stringArray); // Convertir la cadena a array
        console.log('Array recuperado:', array);
        return array;
      } else {
        console.log('No se encontró el array');
        return null;
      }
    } catch (error) {
      console.error('Error al recuperar el array:', error);
      return null;
    }
  };
  useEffect(() => {
    const checkEnvelope = async () => {
      const envelope = await getData('envelope');      
      if (!envelope) return;

      // Normalizar igual que las otras cartas
      const mapped = envelope.map(v => {
        const map = {
          'Mr Hyde': 'MrHyde',
          'Hombre lobo': 'Hombrelobo',
          'Drácula': 'Dracula',
          'Ama de llaves': 'Amadellaves',
          'Panteón': 'Panteon',
          'Salón': 'Salon',
          'Vestíbulo': 'Vestibulo',
        };
        return map[v] ?? v;
      });
      setEnvelopeCards(mapped);
      setEnveloped(envelope);
      setBackFlip(true);
      // Comparar arrays
      if (assumptionManaged.length && mapped.length &&
          assumptionManaged.every((v, i) => v === mapped[i])) {
        setResult("CASO RESUELTO");
        playSolved();
      } else {
        setResult("CASO PERDIDO");
        playLaugh();
      }
    };
    playSuspense();
  

    // Esperar un poco antes de verificar
    const timer = setTimeout(checkEnvelope, 4500);
    return () => clearTimeout(timer);
  }, [assumptionManaged]);
  // Lanzar animación de sello
  useEffect(() => {
    if (!result) return;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, { toValue: 1.2, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  }, [result]);
  const newGame = () => {
    playButtonPress();
    router.push({
        pathname: '/player',
      });
  }
  async function playSuspense() {
    console.log("Cargando suspense");
    try {
      if (suspense) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo suspense existente");
        await suspense.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/suspense.mp3")
      );
      setSuspense(sound);
      console.log("Reproduciendo suspense");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir suspense:", error);
    }
  }
  async function playLaugh() {
    console.log("Cargando laugh");
    try {
      if (laugh) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo laugh existente");
        await laugh.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/lose.mp3")
      );
      setLaugh(sound);
      console.log("Reproduciendo laugh");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir laugh:", error);
    }
  }
  async function playSolved () {
    console.log("Cargando solved");
    try {
      if (solved) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo solved existente");
        await solved.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/siren.mp3")
      );
      setSolved(sound);
      console.log("Reproduciendo solved");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir solved:", error);
    }
  }
  async function playButtonPress () {
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
  return (
    <ImageBackground style={styles.container} source={require("../assets/images/table-back.png")}>
      <Text style={styles.title}>Acusación</Text>
      {/* Cartas ya mostradas */}
      <View style={styles.assumptionContainer}>
        <View style={styles.characterContainer}>
          <Text style={styles.characterName}>{assumption[0]}</Text>
          <Image style={styles.character} source={killersMap[assumptionManaged[0]]} />
        </View>
        <View style={styles.characterContainer}>
          <Text style={styles.characterName}>{assumption[1]}</Text>
          <Image style={styles.character} source={victimsMap[assumptionManaged[1]]} />
        </View>
        <View style={styles.characterContainer}>
          <Text style={styles.characterName}>{assumption[2]}</Text>
          <Image style={styles.character} source={roomsMap[assumptionManaged[2]]} />
        </View>
      </View>

      {/* Cartas animadas saliendo del sobre */}
      <Animated.View
        style={[
          styles.cardAnimated, styles.characterContainer,
          {
            opacity: opacity1,
            transform: [{ translateX: -115 }, { translateY: translateY1 }, { rotate: rotate1 }],
          },
        ]}
      >
        { backFlip ? ( 
          <>
            <Text style={styles.characterName}>{enveloped[0]}</Text>
            <Image style={styles.character} source={killersMap[envelopeCards[0]]} />
          </>
        ) : ( 
            <View style={styles.backColorCard}>
            <Text style={styles.cardAnimatedText}>MIS</Text>
          </View>
        )}
      </Animated.View>

      <Animated.View
        style={[
          styles.cardAnimated, styles.characterContainer,
          {
            opacity: opacity2,
            transform: [{ translateX: 10 },{ translateY: translateY2 }, { rotate: rotate2 }],
          },
        ]}
      >
        { backFlip ? ( 
          <>
          <Text style={styles.characterName}>{enveloped[1]}</Text>
          <Image style={styles.character} source={victimsMap[envelopeCards[1]]} />
        </>
        ) : (
          <View style={styles.backColorCard}>
            <Text style={styles.cardAnimatedText}>TE</Text>
          </View>
        )}
      </Animated.View>

      <Animated.View
        style={[
          styles.cardAnimated, styles.characterContainer,
          {
            opacity: opacity3,
            transform: [{ translateX: 135 }, { translateY: translateY3 }, { rotate: rotate3 }],
          },
        ]}
      >
        { backFlip ? ( 
          <>
          <Text style={styles.characterName}>{enveloped[2]}</Text>
          <Image style={styles.character} source={roomsMap[envelopeCards[2]]} />
        </>
        ) : ( 
          <View style={styles.backColorCard}>
            <Text style={styles.cardAnimatedText}>RIO</Text>
          </View>
        )}
      </Animated.View>

      <ImageBackground style={styles.envelope} source={require("../assets/images/envelope.png")} resizeMode="cover">
        <View style={{ transform: [{ rotate: '-35deg' }] }}>
          <Text style={styles.textEnvelope}>MISTERIO</Text>
        </View>
      </ImageBackground>
      {result && (
          <Animated.View
            style={[
              styles.resultStamp,
              { transform: [{ scale }], opacity },
            ]}
          >
          <View style={{  transform: [{rotate: '-30deg'}], marginLeft: 60 }}>
            <Text
              style={[
                styles.resultText,
                result === 'CASO PERDIDO' ? styles.loseText : styles.winText,
              ]}
            >
              {result === 'CASO PERDIDO' ? 'CASO PERDIDO' : 'CASO RESUELTO'}
            </Text>
            </View>
            <View style={{  marginTop: 30, marginLeft: 50 }}>
              <Pressable style={styles.button} onPress={newGame}>
                <Text style={styles.button_text}>Nuevo caso</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height: "100%",

    filter: 'grayscale(100%)', 
  },
  title: {
    fontFamily: "Creepster-Regular",
    fontSize: 40,
    color: "red",
    marginTop: 100,
  },
  assumptionContainer: {
    marginTop: 10,
    flexDirection: "row",
    marginLeft: 20,
  },
  characterContainer: {
    padding: 5,
    alignItems: "center",
    backgroundColor: "white",
    height: 190,
    width: 105,
    marginRight: 20,
    borderRadius: 10,
  },
  characterName: {
    fontFamily: "Creepster-Regular",
    fontSize: 12,
  },
  character: {
    height: 160,
    width: 100,
    borderRadius: 8,
  },
  envelope: {
    position: "absolute",
    bottom: 100,
    width: 250,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  textEnvelope: {
    fontSize: 35,
    fontFamily: "Creepster-Regular",
    color: "black",
    transform: [{ rotate: "-35deg" }],
  },
  cardAnimated: {
    position: "absolute",
    bottom: 140,
    width: 105,
    height: 170,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resultStamp: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontFamily: "Creepster-Regular",
    fontSize: 50,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
  },
  loseText: {
    color: "red",
    fontFamily: 'SpecialElite'
  },
  winText: {
    color: "limegreen",
    fontFamily: 'SpecialElite'
  },
  button : {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    marginTop: 50,
    marginRight: 50
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 20
  },
  backColorCard: {
    height: 190,
    width: 105,
    backgroundColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardAnimatedText: {
    fontSize:40,
    color: 'white',
    fontFamily: 'Creepster-Regular'
  }
});
