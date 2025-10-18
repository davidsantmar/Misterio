import { useLocalSearchParams, useRouter} from "expo-router";
import { ImageBackground, StyleSheet, Text, View, Image, Pressable, Animated } from "react-native";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShowCardsButton } from "../components/ShowCardsButton";
import { TouchIcon } from "../components/Icons";
import { Audio } from "expo-av";

const killersMap = {
  MrHyde: require('../assets/images/mis/MrHyde.png'),
  Dracula: require('../assets/images/mis/Dracula.png'),
  Frankenstein: require('../assets/images/mis/Frankenstein.png'),
  Hombrelobo : require('../assets/images/mis/Werewolf.png'),
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
  Laboratorio: require('../assets/images/boardImages/Labo.png'),  //Problema con salón, pantéon, vestíbulo por el acento (no se muestra en room)
  Salon: require('../assets/images/boardImages/Lounge.png'),
  Biblioteca: require('../assets/images/boardImages/Library.png'),
  Alcoba: require('../assets/images/boardImages/Bedroom.png'),
  Cocheras: require('../assets/images/boardImages/garage.png'),
  Vestibulo: require('../assets/images/boardImages/lobby.png'),
  Panteon: require('../assets/images/boardImages/pantheon.png'),
  Bodega: require('../assets/images/boardImages/wine-cellar.png'),
};
const gifMap = {
  Laboratorio: require("../assets/gifs/lab.gif"),
  Salon: require("../assets/gifs/lounge.gif"),
  Biblioteca: require("../assets/gifs/library.gif"),
  Alcoba: require("../assets/gifs/bedroom.gif"),
  Cocheras: require("../assets/gifs/garage.gif"),
  Vestibulo: require("../assets/gifs/lobby.gif"),
  Bodega: require("../assets/gifs/wine-cellar.gif"),
  Panteon: require("../assets/gifs/pantheon.gif"),
};



export default function Room() {
  const { room } = useLocalSearchParams();
  const router = useRouter();
  const [killersOpacity, setKillersOpacity] = useState(0);
  const [charactersOpacity, setCharactersOpacity] = useState(0);
  const [assumptionOpacity, setAssumptionOpacity] = useState(0);
  const [gifSource, setGifSource] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // New state to track selected section
  const [killer, setKiller] = useState(null); 
  const [victim, setVictim] = useState(null);
  const [instructionText, setInstructionText] = useState("Selecciona un sospechoso y una víctima con los botones MIS y TE (ten en cuenta tus cartas)");
  const [opacityBack, setOpacityBack] = useState(1);
  const [player, setPlayer] = useState(null);
  const [computerCards, setComputerCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [assumption, setAssumption] = useState([]);
  const [killerPrefix, setKillerPrefix] = useState(null);
  const [victimPrefix, setVictimPrefix] = useState(null);
  const [roomPrefix, setRoomPrefix] = useState(null);
  const rotacionAnimada = useRef(new Animated.Value(0)).current; // Valor animado para la rotación
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [showComputerCard, setShowComputerCard] = useState(false);
  const [assumptionComputerCards, setAssumptionComputerCards] = useState([]);
  const [bigCardText, setBigCardText] = useState(null);
  const [killers, setKillers] = useState(['Mr Hyde', 'Drácula', 'Frankenstein', 'Hombre lobo', ' Fantasma' , 'Momia']);
  const [victims, setVictims] = useState(['Conde', 'Condesa', 'Jardinero', 'Ama de llaves', 'Mayordomo', 'Doncella']);
  const [rooms, setRooms] = useState(['Laboratorio', 'Salón', 'Biblioteca', 'Alcoba', 'Cocheras', 'Vestíbulo', 'Panteón', 'Bodega']);
  const [computerCardCharacter, setComputerCardCharacter] = useState(null);
  const [computerCardNameToShow, setComputerCardNameToShow] = useState(null);
  const [showAccuseButtons, setShowAccuseButtons] = useState(false);
  const [buttonPress, setButtonPress] = useState(null);
  const [cardsDeployed, setCardsDeployed] = useState(null);
  const [showcards, setShowcards] = useState(null);
  const [hidecards, setHidecards] = useState(null);
  const [shine, setShine] = useState(null);
  const [roomNameToShow, setRoomNameToShow] = useState(null);
  useEffect(() => { //adding accent to exceptions to show room's name
    if (room === 'Salon'){
      setRoomNameToShow('Salón')
    }else
    if (room === 'Panteon'){
      setRoomNameToShow('Panteón')
    }else
    if (room === 'Vestibulo'){
      setRoomNameToShow('Vestíbulo')
    }else{
      setRoomNameToShow(room)
    }
  }, [room])
  useEffect(() => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
  
      // Liberación de sonidos al desmontar el componente
      return () => {
       
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
        if (shine) {
          console.log("Liberando shine");
          shine.unloadAsync();
        }
      };
    },[buttonPress, hidecards, showcards, shine]);

  const handleShowCardsPress = () => {
    !cardsDeployed ? playShowcards() : playHidecards();
    setOpacityBack(opacityBack === 1 ? 0.5 : 1);
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
async function playShine() {
  console.log("Cargando shine");
  try {
    if (shine) {
      // Si el sonido ya está cargado, reutilízalo
      console.log("Reproduciendo shine existente");
      await shine.replayAsync();
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/card-appears.mp3")
    );
    setShine(sound);
    console.log("Reproduciendo shine");
    await sound.playAsync();
  } catch (error) {
    console.error("Error al reproducir shine:", error);
  }
}
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
  const getPlayer = async () => {
    try {
      const currentPlayer = await AsyncStorage.getItem('player'); // Obtener la cadena
      return currentPlayer;
    } catch (error) {
      console.error('Error al recuperar el player:', error);
      return null;
    }
  };
  const storePlayerPosition = async (position) => {
    try {
        await AsyncStorage.setItem('position', position);
    } catch (e) {
        console.log('error saving data');
    }
  };
  useEffect(()=> {
    const misComputerCards = assumptionComputerCards.filter(elemento => killers.includes(elemento));
    const teComputerCards = assumptionComputerCards.filter(elemento => victims.includes(elemento));
    const rioComputerCards = assumptionComputerCards.filter(elemento => rooms.includes(elemento));
    setComputerCardNameToShow(assumptionComputerCards[0]);
    if (misComputerCards.length > 0) {
      setBigCardText('MIS');
      if (assumptionComputerCards[0] === 'Mr Hyde'){
        assumptionComputerCards.splice(0, 1);
        assumptionComputerCards.splice(0, 1, 'MrHyde');
      }
      if (assumptionComputerCards[0] === 'Hombre lobo'){
        assumptionComputerCards.splice(0, 1);
        assumptionComputerCards.splice(0, 1, 'Hombrelobo');
      }
       if (assumptionComputerCards[0] === 'Drácula'){
        assumptionComputerCards.splice(0, 1);
        assumptionComputerCards.splice(0, 1, 'Dracula');
      }
      setComputerCardCharacter(killersMap[assumptionComputerCards[0]])
    } else if (teComputerCards.length > 0) {
      setBigCardText('TE');
      if (assumptionComputerCards[1] === 'Ama de llaves'){
        assumptionComputerCards.splice(0, 1);
        assumptionComputerCards.splice(0, 1, 'Amadellaves');
      }
      setComputerCardCharacter(victimsMap[assumptionComputerCards[0]])
    } else if (rioComputerCards.length > 0) {
      setBigCardText('RIO');
      if (assumptionComputerCards[2] === 'Panteón'){
        assumptionComputerCards.splice(0, 1);
        assumptionComputerCards.splice(0, 1, 'Panteon');
      }
      if (assumptionComputerCards[2] === 'Salón'){
        assumptionComputerCards.splice(0, 1);
        assumptionComputerCards.splice(0, 1, 'Salon');
      }
      if (assumptionComputerCards[2] === 'Vestíbulo'){
        assumptionComputerCards.splice(0, 1);
        assumptionComputerCards.splice(0, 1, 'Vestibulo');
      }
      setComputerCardCharacter(roomsMap[assumptionComputerCards[0]])
    }
  }, [assumptionComputerCards, killers, victims, rooms]);
  useEffect(() => {
    getPlayer().then((player) => {
      setPlayer(player); // Actualizar el estado con el valor obtenido
    });
    if (room === 'Laboratorio'){
      setRoomPrefix('el'); 
      storePlayerPosition('4');
    }
    if (room === 'Alcoba'){
      setRoomPrefix('la');
      storePlayerPosition('27');
    }
    if (room === 'Cocheras'){
      setRoomPrefix('las')
    }
    if (room === 'Panteón'){
      setRoomPrefix('el')
    }
    if (room === 'Bodega'){
      setRoomPrefix('la')
    }
    if (room === 'Salón'){
      setRoomPrefix('el');
       storePlayerPosition('12');
    }
    if (room === 'Vestíbulo'){
      setRoomPrefix('el')
    }
    if (room === 'Biblioteca'){
      setRoomPrefix('la');
       storePlayerPosition('21');
    }
  }, []);

  useEffect(() => {
    getData('computerCards').then((computerCards) => {
      setComputerCards(computerCards); // Actualizar el estado con el valor obtenido
    });
    getData('playerCards').then((playerCards) => {
      setPlayerCards(playerCards); 
    });
  }, []);
  
  useEffect(() => {
      // Define la animación de flotación
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -20, // Equivalente a translateY(-20px)
            duration: 1000, // 50% del ciclo (mitad de 2 segundos)
            useNativeDriver: true, // Mejora el rendimiento
          }),
          Animated.timing(floatAnim, {
            toValue: 0, // Vuelve a translateY(0)
            duration: 1000, // Otra mitad del ciclo
            useNativeDriver: true,
          }),
        ])
      );
      // Inicia la animación
      animation.start();
      // Limpia la animación al desmontar el componente
      return () => animation.stop();
    }, [floatAnim]);
  useEffect(() => {
    console.log("Room parameter:", room);
    if (gifMap[room] && roomsMap[room]) {
      setGifSource(gifMap[room]); // Establecer el GIF inicialmente
      // Cambiar al PNG después de 5500ms
      const timer = setTimeout(() => {
        setGifSource(roomsMap[room]);
      }, 5500);

      // Limpiar el temporizador al desmontar o cuando cambie `room`
      return () => clearTimeout(timer);
    } else {
      // Manejar caso de sala no encontrada
      setGifSource(null);
      console.warn(`No se encontraron recursos para la sala: ${room}`);
    }
  }, [room]);
  // Mostrar un componente de fallback si no hay recurso válido
  if (!gifSource) {
    return (
      <View style={styles.container}>
        <Text>Sala no encontrada: {room}</Text>
      </View>
    );
  }
  const rotacion = rotacionAnimada.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const opacidadFrente = rotacionAnimada.interpolate({
    inputRange: [90, 180],
    outputRange: [1, 0],
  });
  const opacidadTrasera = rotacionAnimada.interpolate({
    inputRange: [0, 90],
    outputRange: [0, 1],
  });
  const showSection = (section) => {
    console.log('sectio', section)
    playButtonPress();
    setSelectedSection(section); // Update the selected section
    if (section === "killers") {
      setKillersOpacity(1); // Show killers
      setCharactersOpacity(0); // Hide characters
      setInstructionText("Selecciona un sospechoso");
    } else if (section === "characters") {
      setCharactersOpacity(1); // Show characters
      setKillersOpacity(0); // Hide killers
      setInstructionText("Selecciona una víctima");
    }else if (section === roomNameToShow) {
      setCharactersOpacity(0); // Hide characters
      setKillersOpacity(0); // Hide killers
      setInstructionText(roomNameToShow)
    }
  };
  const showKiller = (killer) => {    
    setAssumptionOpacity(1);
    showSection("characters")
    setKiller(killer);
    if (killer === 'Mr Hyde'){
      setKillerPrefix(null)
    }
    if (killer === 'Drácula'){
      setKillerPrefix(null)
    }
    if (killer === 'Frankenstein'){
      setKillerPrefix(null)
    }
    if (killer === 'Hombre lobo'){
      setKillerPrefix('el')
    }
    if (killer === 'Fantasma'){
      setKillerPrefix('el')
    }
    if (killer === 'Momia'){
      setKillerPrefix('la')
    }
  }
  const showVictim = (victim) => {    
    setAssumptionOpacity(1);
    setVictim(victim);
    showSection("killers")
    if (victim === 'Conde'){
      setVictimPrefix('al')
    }
    if (victim === 'Condesa'){
      setVictimPrefix('a la')
    }
    if (victim === 'Jardinero'){
      setVictimPrefix('al')
    }
    if (victim === 'Ama de llaves'){
      setVictimPrefix('al')
    }
    if (victim === 'Mayordomo'){
      setVictimPrefix('al')
    }
    if (victim === 'Doncella'){
      setVictimPrefix('a la')
    }
  }
  const charactersSection = () => {
    if (selectedSection === "killers") {
      return (
        <View style={[styles.killersContainer, { opacity: killersOpacity }]}>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Mr Hyde")}>
            <Text style={styles.characterName}>Dr Jekyll/Mr Hyde</Text>
            <Image style={styles.character} source={require("../assets/images/mis/MrHyde.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Drácula")}>
            <Text style={styles.characterName}>Drácula</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Dracula.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Frankenstein")}>
            <Text style={styles.characterName}>Frankenstein</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Frankenstein.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Hombre lobo")}>
            <Text style={styles.characterName}>Hombre lobo</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Werewolf.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Fantasma")}>
            <Text style={styles.characterName}>Fantasma</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Ghost.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Momia")}>
            <Text style={styles.characterName}>Momia</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Mummy.png")} />
          </Pressable>
        </View>
      );
    } else if (selectedSection === "characters") {
      return (
        <View style={[styles.charactersContainer, { opacity: charactersOpacity }]}>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("Conde")}>
            <Text style={styles.characterName}>Conde</Text>
            <Image style={styles.character} source={require("../assets/images/te/Count.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("Condesa")}>
            <Text style={styles.characterName}>Condesa</Text>
            <Image style={styles.character} source={require("../assets/images/te/Countess.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("Jardinero")}>
            <Text style={styles.characterName}>Jardinero</Text>
            <Image style={styles.character} source={require("../assets/images/te/Gardener.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("Ama de llaves")}>
            <Text style={styles.characterName}>Ama de llaves</Text>
            <Image style={styles.character} source={require("../assets/images/te/Housekeeper.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("Mayordomo")}>
            <Text style={styles.characterName}>Mayordomo</Text>
            <Image style={styles.character} source={require("../assets/images/te/Butler.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("Doncella")}>
            <Text style={styles.characterName}>Doncella</Text>
            <Image style={styles.character} source={require("../assets/images/te/Maid.png")} />
          </Pressable>
        </View>
      )
    }else if (selectedSection === roomNameToShow) {
      return null;
    }
    return null; // Return nothing if no section is selected
  };
  const manejarPresionInicio = () => {
    playShine();
    Animated.timing(rotacionAnimada, {
      toValue: 180, // Rotar a 180 grados
      duration: 600, // Duración de la animación (como en el CSS)
      useNativeDriver: true,
    }).start();
  };

  // Maneja el fin del toque (equivalente a salir del hover)
  const manejarPresionFin = () => {
    Animated.timing(rotacionAnimada, {
      toValue: 0, // Volver a 0 grados
      duration: 600,
      useNativeDriver: true,
    }).start();
  };
  const manageAssumption = () => {
    playButtonPress();
    setAssumptionOpacity(0);
    setKillersOpacity(0);
    setCharactersOpacity(0);
    setShowComputerCard(true);
    assumption.push(killer);
    assumption.push(victim);
    assumption.push(room);
    const ocurrences = assumption.filter(elemento => computerCards.includes(elemento));
      setAssumptionComputerCards(ocurrences);
      console.log('ocurrences', ocurrences);
      if (ocurrences.length > 0){
        
        if (player === 'Nely'){
          setInstructionText('El inspector David te muestra la siguiente carta')
        }else if (player === 'David'){
          setInstructionText('La detective Nely te muestra la siguiente carta')
        }
      }else if (ocurrences <= 0){
        setShowAccuseButtons(true);
        if (player === 'Nely'){
          //es necesaria esta tabulación en los setters para mostrar el texto en la forma correcta
          setInstructionText(`El inspector David no tiene cartas que mostrarte. 
Tu hipótesis es que ${killerPrefix === null ? "" : killerPrefix} ${killer} ha asesinado ${victimPrefix} ${victim} en ${roomPrefix} ${room}. 
Cuidado! Si acusas y no estás en lo cierto habrás perdido la partida. 
Revisa bien tus cartas.`);
        }else if (player === 'David'){
          setInstructionText(`La detective Nely no tiene cartas que mostrarte. 
Tu hipótesis es que ${killerPrefix === null ? "" : killerPrefix} ${killer} ha asesinado ${victimPrefix} ${victim} en ${roomPrefix} ${room}. 
Cuidado! Si acusas y no estás en lo cierto habrás perdido la partida. 
Revisa bien tus cartas`)
        }
      }
    console.log('assumption', assumption)
  } 
 
    const showOcurrences = () => {
      if (assumptionComputerCards.length > 0) {
        return(  
          <View style={styles.containerOcurrence}>
              <Pressable onPressIn={manejarPresionInicio} onPressOut={manejarPresionFin}>
              <Animated.View style={{ transform: [{ rotateY: rotacion }] }}>
                <Animated.View style={{ opacity: opacidadFrente }}>
                  <ImageBackground style={styles.flipCardBack}>
                    <Text style={styles.bigCardText}>{bigCardText}</Text>
                  </ImageBackground>
                </Animated.View>
                <Animated.View style={[styles.flipCardFront, { opacity: opacidadTrasera, transform: [{ rotateY: '180deg' }] }]}>
                  <View style={styles.computerCharacterContainer}>
                    <Text style={styles.computerCharacterName}>{computerCardNameToShow}</Text> 
                    <ImageBackground style={styles.computerCharacter} source={computerCardCharacter} /> 
                  </View>
                </Animated.View>
              </Animated.View>
            </Pressable>
            <View style={styles.pressCardContainer}>
              <Animated.View style={[
                styles.iconContainer,
                { transform: [{ translateY: floatAnim }] }, // Aplica la animación
              ]}>
                <View style={styles.iconContainer}>
                  <TouchIcon style={styles.iconStyles} />
                  <Text style={styles.pressText} >Presiona la carta para descubrirla</Text>
                </View>
              </Animated.View>
            </View>        
        </View>
        )
      }
    }
  const assumptionSection = () => {
    return(
        <View style={[styles.assumptionContainer, { opacity: assumptionOpacity }]}>
          <Text style={styles.text}>Supones que {killerPrefix} {killer} ha asesinado {victimPrefix} {victim} en {roomPrefix} {room}</Text>
          <View style={styles.buttonsContainer}>
            {(victim !== null && killer !== null) ? (
              <>
                <Pressable style={styles.button} onPress={manageAssumption}>
                  <Text style={styles.buttonText}>Confirmar suposición</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => setAssumptionOpacity(0)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      )
  }
  const cancelAccuse = () => {
    playButtonPress();
    setInstructionText("Selecciona un sospechoso y una víctima con los botones MIS y TE (ten en cuenta tus cartas)");
    setShowAccuseButtons(false);
    setShowComputerCard(false);
  }
  const toAccuse = () => {
    playButtonPress();
      router.push({
        pathname: "/accuse",
        params:  assumption , 
      });
  }
  const toBoard = () => {
    router.push({
      pathname: "/dice",
    });
  }
  return (
    <>
      <ShowCardsButton onPress={handleShowCardsPress} />
      <ImageBackground style={[styles.container, { opacity: opacityBack }]} source={gifSource} resizeMode="cover">
        <View style={styles.boardButtonContainer}>
          <Pressable style={styles.boardButton} onPress={toBoard}>
            <Text style={styles.boardButtonText}>Al pasillo</Text>
          </Pressable>
        </View>
        <View style={styles.envelopeContainer}>
          <Pressable style={styles.envelope} onPress={() => showSection("killers")}>
            <Text style={styles.textEnvelope}>MIS</Text>
            <Text style={styles.plusEnvelope}>+</Text>
          </Pressable>
          <Pressable style={styles.envelope} onPress={() => showSection("characters")}>
            <Text style={styles.textEnvelope}>TE</Text>
            <Text style={styles.plusEnvelope}>+</Text>
          </Pressable>
          <Pressable style={styles.envelope} onPress={() => showSection(roomNameToShow)}>
            <Text style={styles.textEnvelope}>RIO</Text>
            <Text style={styles.roomEnvelope}>{roomNameToShow}</Text>
          </Pressable>
        </View>
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsCloud}>
            <Text style={styles.text}>{instructionText}</Text>
            {showAccuseButtons ? 
              <View style={styles.buttonsContainer}>
                  <>
                    <Pressable style={styles.button} onPress={toAccuse}>
                      <Text style={styles.accuseText}>Acuso</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={cancelAccuse}>
                      <Text style={styles.buttonText}>Cancelar</Text>
                    </Pressable>
                  </>
              </View> : null
            }
          </View>
        </View>
        {!showComputerCard ? charactersSection() : showOcurrences()} 
        {assumptionSection()}
      </ImageBackground>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    marginBottom: 60,
    //opacity: 0.6
  },
  envelopeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 5
  },
  envelope: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    marginHorizontal: 5,
    padding: 10,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    right: 20
  },
  textEnvelope: {
    fontFamily: "Creepster-Regular",
    fontSize: 20,
  },
  plusEnvelope: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 15,
  },
  roomEnvelope: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
    width: 70, // Fixed width to avoid overflow
  },
  title: {
    justifyContent: "center",
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontFamily: "Creepster-Regular",
    fontSize: 15,
  },
  killersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    flexWrap: "wrap",
  },
  charactersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    flexWrap: "wrap",
  },
  characterContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  roomTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    flexWrap: "wrap",
  },
  characterName: {
    fontFamily: "Creepster-Regular",
    fontSize: 12,
  },
  character: {
    height: 175,
    width: 100,
  },
  assumptionContainer: {
    justifyContent: "center",
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontFamily: "Creepster-Regular",
  },
  instructionsContainer: {
    padding: 15,
  },
  instructionsCloud: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
  },
  containerOcurrence: {
    flex: 1,
    alignItems: "center", 
  },
  flipCardFront: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'  
  },
  flipCardBack: {
    width: 200, 
    height: 350, 
    resizeMode: "cover", 
    borderRadius: 10, 
    backgroundColor: 'black', 
    borderWidth: 2, 
    borderColor: 'red', 
    marginTop: 5, 
    alignItems: 'center',
    justifyContent: 'center' 
  },
  bigCardText: {
    fontFamily: 'Creepster-Regular',
    fontSize: 50,
    color: 'white',
    alignItems: 'center'
  },
  computerCharacterContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
  },
  computerCharacterName: {
    fontFamily: "Creepster-Regular",
    fontSize: 15,
    marginTop: 10
  },
  computerCharacter: {
    height: 310,
    width: 190,
  },
  pressCardContainer: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  iconContainer: {
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: 'center',
    width: '70%'
  },
  pressText: { 
    color: "white", 
    marginTop: 10, 
    fontFamily: 'Creepster-Regular', 
    fontSize: 20
  },
  iconStyles: {
    fontSize: 48, 
    marginTop: 20
  },
  accuseText: {
    fontSize: 15,
    fontFamily: 'Creepster-Regular',
    color: 'white'
  },
  boardButtonContainer: {
    marginTop: 70,
    marginRight: 230
  },
  boardButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 5,
    marginRight: 50,

  },
  boardButtonText: {
    fontSize: 10,
    fontFamily: 'Creepster-Regular'
  }
});