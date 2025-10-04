import { useLocalSearchParams } from "expo-router";
import { ImageBackground, StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mapa de recursos estáticos con require
const killers = {
  MrHyde: require('../assets/images/mis/MrHyde.png'),
  Dracula: require('../assets/images/mis/Dracula.png'),
  Frankenstein: require('../assets/images/mis/Frankenstein.png'),
  Hombrelobo : require('../assets/images/mis/Werewolf.png'),
  Fantasma: require('../assets/images/mis/Ghost.png'),
  Momia: require('../assets/images/mis/Mummy.png'),
};
const victims = {
  Conde: require('../assets/images/te/Count.png'),
  Condesa: require('../assets/images/te/Countess.png'),
  Jardinero: require('../assets/images/te/Gardener.png'),
  Amadellaves: require('../assets/images/te/Housekeeper.png'),
  Mayordomo: require('../assets/images/te/Butler.png'),
  Doncella: require('../assets/images/te/Maid.png'),
};
const rooms = {
  Laboratorio: require('../assets/images/boardImages/Labo.png'),
  Salon: require('../assets/images/boardImages/Lounge.png'),
  Biblioteca: require('../assets/images/boardImages/Library.png'),
  Alcoba: require('../assets/images/boardImages/Bedroom.png'),
  /*Cocheras: require('../assets/images/boardImages/Garage.png'),
  Vestibulo: require('../assets/images/boardImages/Lobby.png'),
  Panteon: require('../assets/images/boardImages/Pantheon.png'),
  Bodega: require('../assets/images/boardImages/Store.png'),*/
};
const gifMap = {
  Laboratorio: require("../assets/gifs/Laboratorio.gif"),
  /*Salon: require("../assets/gifs/Salon.gif"),
  Biblioteca: require("../assets/gifs/Biblioteca.gif"),
  Alcoba: require("../assets/gifs/Alcoba.gif"),*/
};

const imageMap = {
  Laboratorio: require("../assets/images/Laboratorio.png"),
  /*Salon: require("../assets/images/Salon.png"),
  Biblioteca: require("../assets/images/Biblioteca.png"),
  Alcoba: require("../assets/images/Alcoba.png"),*/
};
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

export default function Room() {
  const { room } = useLocalSearchParams();
  const [killersOpacity, setKillersOpacity] = useState(0);
  const [charactersOpacity, setCharactersOpacity] = useState(0);
  const [assumptionOpacity, setAssumptionOpacity] = useState(0);
  const [gifSource, setGifSource] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // New state to track selected section
  const [killer, setKiller] = useState(""); 
  const [victim, setVictim] = useState("");
  const [instructionText, setInstructionText] = useState("Selecciona un sospechoso y una víctima con los botones MIS y TE");
  const [position, setPosition] = useState('absolute'); // Estado inicial: absolute
  const [rotation1, setRotation1] = useState('25deg');
  const [rotation2, setRotation2] = useState('45deg');
  const [cardBorderColor, setCardBorderColor] = useState('red');
  const [misText, setMisText] = useState('MIS');
  const [cardBorderWidth, setCardBorderWidth] = useState(2);
  const [cardMarginTop, setCardMarginTop] = useState(20);
  const [cardTextFontSize, setCardTextFontSize] = useState(15);
  const [card1, setCard1] = useState('');
  const [card2, setCard2] = useState('');
  const [card3, setCard3] = useState('');
  const [card4, setCard4] = useState('');
  const [card5, setCard5] = useState('');
  const [card6, setCard6] = useState('');
  const [card7, setCard7] = useState('');
  const [card8, setCard8] = useState('');
  const [playerCards, setPlayerCards] = useState([]);
  const [cardNames, setCardNames] = useState([]);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  useEffect(() => {
    console.log('playerCards desde Room', playerCards);    
  }, [playerCards]);
  useEffect(() => {
    console.log("Room parameter:", room);
    getData('playerCards').then((retrievedPlayerCards) => {
      const playerCardsWithoutSpaces = retrievedPlayerCards.map(string => string.replace(/\s/g, '')); //remove spaces in array elements
      const playerCardsWithSpaces = retrievedPlayerCards;
      setPlayerCards(playerCardsWithoutSpaces);
      setCardNames(playerCardsWithSpaces);
    });
    if (gifMap[room] && imageMap[room]) {
      setGifSource(gifMap[room]); // Establecer el GIF inicialmente
      // Cambiar al PNG después de 5500ms
      const timer = setTimeout(() => {
        setGifSource(imageMap[room]);
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
  const showSection = (section) => {
    setSelectedSection(section); // Update the selected section
    if (section === "killers") {
      setKillersOpacity(1); // Show killers
      setCharactersOpacity(0); // Hide characters
      setInstructionText("Selecciona un sospechoso");
    } else if (section === "characters") {
      setCharactersOpacity(1); // Show characters
      setKillersOpacity(0); // Hide killers
      setInstructionText("Selecciona una víctima");
    }else if (section === "") {
      setCharactersOpacity(0); // Hide characters
      setKillersOpacity(0); // Hide killers
    }
  };
  const showKiller = (killer) => {    
    setAssumptionOpacity(1);
    setKiller(killer);
  }
  const showVictim = (victim) => {    
    setAssumptionOpacity(1);
    setVictim(victim);
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
          <Pressable style={styles.characterContainer} onPress={() => showKiller("El hombre lobo")}>
            <Text style={styles.characterName}>Hombre lobo</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Werewolf.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("El fantasma")}>
            <Text style={styles.characterName}>Fantasma</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Ghost.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("La momia")}>
            <Text style={styles.characterName}>Momia</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Mummy.png")} />
          </Pressable>
        </View>
      );
    } else if (selectedSection === "characters") {
      return (
        <View style={[styles.charactersContainer, { opacity: charactersOpacity }]}>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("al Conde")}>
            <Text style={styles.characterName}>Conde</Text>
            <Image style={styles.character} source={require("../assets/images/te/Count.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("a la condesa")}>
            <Text style={styles.characterName}>Condesa</Text>
            <Image style={styles.character} source={require("../assets/images/te/Countess.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("al jardinero")}>
            <Text style={styles.characterName}>Jardinero</Text>
            <Image style={styles.character} source={require("../assets/images/te/Gardener.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("al ama de llaves")}>
            <Text style={styles.characterName}>Ama de llaves</Text>
            <Image style={styles.character} source={require("../assets/images/te/Housekeeper.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("al mayordomo")}>
            <Text style={styles.characterName}>Mayordomo</Text>
            <Image style={styles.character} source={require("../assets/images/te/Butler.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("a la doncella")}>
            <Text style={styles.characterName}>Doncella</Text>
            <Image style={styles.character} source={require("../assets/images/te/Maid.png")} />
          </Pressable>
        </View>
      );
    }else if (selectedSection === "") {
      return (
        <View style={styles.roomTitleContainer}>
          <View style={styles.title}>
            <Text style={styles.text}>{room}</Text>
          </View>
        </View>
      )
    }
    return null; // Return nothing if no section is selected
  };
  const assumptionSection = () => {
    return(
      <View style={[styles.assumptionContainer, { opacity: assumptionOpacity }]}>
        <Text style={styles.text}>Supones que {killer} ha asesinado {victim} en el {room}</Text>
        <View style={styles.buttonsContainer}>
          {victim !== "" && killer !== "" ? (
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
  const showCards = () => {
    setPosition(prevPosition => 
      prevPosition === 'absolute' ? 'relative' : 'absolute'
    );
    setRotation1(prevRotation =>
      prevRotation === '25deg' ? '0deg' : '25deg'
    )
    setRotation2(prevRotation =>
      prevRotation === '45deg' ? '0deg' : '45deg'
    )
    setCardBorderColor(prevColor => 
      prevColor === 'red' ? '' : 'red'
    )
    setCardBorderWidth(prevBorder => 
      prevBorder === 2 ? 0 : 2
    )
    setMisText(prevText => 
      prevText === 'MIS' ? playerCards[7] : 'MIS'
    )
    setCardMarginTop(prevTop => 
      prevTop === 20 ? 10 : 20
    )
    setCardTextFontSize(prevFontSize =>
      prevFontSize === 15 ? 10 : 15
    )
    setCard1(prevCard => prevCard === '' ? killers[playerCards[0]] : '');
    setCard2(prevCard => prevCard === '' ? killers[playerCards[1]] : '');
    setCard3(prevCard => prevCard === '' ? victims[playerCards[2]] : '');
    setCard4(prevCard => prevCard === '' ? victims[playerCards[3]] : '');
    setCard5(prevCard => prevCard === '' ? victims[playerCards[4]] : '');
    setCard6(prevCard => prevCard === '' ? rooms[playerCards[5]] : '');
    setCard7(prevCard => prevCard === '' ? rooms[playerCards[6]] : '');
    setCard8(prevCard => prevCard === '' ? rooms[playerCards[7]] : '');
    setBackgroundOpacity(prevOpacity =>
      prevOpacity === 1 ? 0.5 : 1
    )
  }
  const manageAssumption = () => {
    setAssumptionOpacity(0);
    // También podrías resetear los estados si es necesario
    setKiller("");
    setVictim("");
    setKillersOpacity(0);
    setCharactersOpacity(0);
    getData('envelope').then((retrievedEnvelope) => {
      if (retrievedEnvelope) {
        console.log('Sobre guardado:', retrievedEnvelope);
      }
    });
  } 
  return (
    <>
    <View style={{
          position: 'absolute',
          bottom: 750,
          alignSelf: 'center',
          zIndex: 1,
          left: 335,
        }}>
          <Pressable 
            style={styles.yourCardsContainer}
            onPress={showCards}
          >
            <Text style={styles.yourCardsText}>Tus cartas</Text>
              <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, borderRadius: 8, marginTop: cardMarginTop }]} source={card1} resizeMode="cover">
                <Text style={styles.cardName}>{cardNames[0]}</Text>
            </ImageBackground>
            
            <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card2} resizeMode="contain">
                <Text style={styles.cardName}>{cardNames[1]}</Text>
            </ImageBackground>
            <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card3} resizeMode="contain">
              <Text style={styles.cardName}>{cardNames[2]}</Text>
            </ImageBackground>
            <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card4} resizeMode="contain">
              <Text style={styles.cardName}>{cardNames[3]}</Text>
            </ImageBackground>
            <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card5} resizeMode="contain">
              <Text style={styles.cardName}>{cardNames[4]}</Text>
            </ImageBackground>
            <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card6} resizeMode="contain">
              <Text style={styles.cardName}>{cardNames[5]}</Text>
            </ImageBackground>
            <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop, transform: [{rotate: (rotation1)}]} ]} source={card7} resizeMode="contain">
              <Text style={styles.cardName}>{cardNames[6]}</Text>
            </ImageBackground>
            <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop, transform: [{rotate: (rotation2)}]} ]} source={card8} resizeMode="contain">
                <Text style={[styles.cardText, { fontSize: cardTextFontSize  }]}>{misText}</Text>
            </ImageBackground>
          </Pressable>
        </View>
      <ImageBackground style={[styles.container, { opacity: backgroundOpacity }]} source={gifSource} resizeMode="cover">
        <View style={styles.envelopeContainer}>
          <Pressable style={styles.envelope} onPress={() => showSection("killers")}>
            <Text style={styles.textEnvelope}>MIS</Text>
            <Text style={styles.plusEnvelope}>+</Text>
          </Pressable>
          <Pressable style={styles.envelope} onPress={() => showSection("characters")}>
            <Text style={styles.textEnvelope}>TE</Text>
            <Text style={styles.plusEnvelope}>+</Text>
          </Pressable>
          <Pressable style={styles.envelope} onPress={() => showSection("")}>
            <Text style={styles.textEnvelope}>RIO</Text>
            <Text style={styles.roomEnvelope}>{room}</Text>
          </Pressable>
        </View>
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsCloud}>
            <Text style={styles.text}>{instructionText}</Text>
          </View>
        </View>
        {charactersSection()} 
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
    marginTop: 100,
    marginBottom: 20
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
  },
  textEnvelope: {
    fontFamily: "Creepster-Regular",
    fontSize: 24,
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
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
  roomEnvelope: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 10,
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
    fontSize: 20,
  },
  yourCardsContainer: {
    backgroundColor: '#6200ee',
    borderRadius: 5,
    width: 70,
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
    
  },
  yourCardsText: {
    color: 'white',
    padding: 2,
    fontSize: 10
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
    marginTop: 20,
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
    width: "90%",
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
    marginBottom: 10,
  },
  card: {
    width: 60,
    height: 90,
    backgroundColor: 'black',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    color: 'white',
    backgroundColor: 'black',
    fontFamily: 'Creepster-Regular',
    fontSize: 10,
    padding: 2
  },
  cardText: {
    color: 'white',
    fontFamily: 'Creepster-Regular',
    fontSize: 15,
  }
});