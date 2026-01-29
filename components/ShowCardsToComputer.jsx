import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Audio } from "expo-av";
import { useRouter} from "expo-router";

const clues = {
  MrHyde: require("../assets/images/mis/MrHyde.png"),
  Drácula: require("../assets/images/mis/Dracula.png"),
  Frankenstein: require("../assets/images/mis/Frankenstein.png"),
  Hombrelobo: require("../assets/images/mis/Werewolf.png"),
  Fantasma: require("../assets/images/mis/Ghost.png"),
  Momia: require("../assets/images/mis/Mummy.png"),
  Conde: require("../assets/images/te/Count.png"),
  Condesa: require("../assets/images/te/Countess.png"),
  Jardinero: require("../assets/images/te/Gardener.png"),
  Amadellaves: require("../assets/images/te/Housekeeper.png"),
  Mayordomo: require("../assets/images/te/Butler.png"),
  Doncella: require("../assets/images/te/Maid.png"),
  Laboratorio: require("../assets/images/boardImages/Labo.png"),
  Salón: require("../assets/images/boardImages/Lounge.png"),
  Biblioteca: require("../assets/images/boardImages/Library.png"),
  Alcoba: require("../assets/images/boardImages/Bedroom.png"),
  Cocheras: require("../assets/images/boardImages/garage.png"),
  Vestíbulo: require("../assets/images/boardImages/lobby.png"),
  Panteón: require("../assets/images/boardImages/pantheon.png"),
  Bodega: require("../assets/images/boardImages/wine-cellar.png"),
};

export function ShowCardsToComputer({ cards, room, diceValue }) {
  const [loaded, error] = useFonts({
    "Creepster-Regular": require("../assets/fonts/Creepster-Regular.ttf"),
  });
  const [position, setPosition] = useState("absolute");
  const [cardMarginTop, setCardMarginTop] = useState(30);
  const [card0, setCard0] = useState("");
  const [card1, setCard1] = useState("");
  const [card2, setCard2] = useState("");
  const [shine, setShine] = useState(null);
  const [computerData, setComputerData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [text, setText] = useState("");
  const router = useRouter();
  useEffect(() => {
    console.log("cards To Show", cards);
    console.log("habir", room);
    showCards();
  }, [cards, room]);
  useEffect (() => {
    setText("Tus cartas para mostrar")
  }, [text])
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    return () => {
      if (shine) {
        shine.unloadAsync();
      }
    };
  }, [shine]);
  useEffect(() => {
    const init = async () => {
      try {
        const value = await AsyncStorage.getItem("computerData");
        if (value !== null) {
          const parsedData = JSON.parse(value);
          setComputerData(parsedData);
          console.log('computerData parseado y guardado:', parsedData);
        } else {
          console.log('No hay datos guardados en computerData');
        }
        const value1 = await AsyncStorage.getItem("playerData");
        console.log("value1", value1)
        if (value1 !== null) {
          const parsedData1 = JSON.parse(value1);
          setPlayerData(parsedData1);
          console.log('playerData parseado y guardado:', parsedData1);
        } else {
          console.log('No hay datos guardados en playerData');
        }
      } catch (error) {
        console.error("Error leyendo computerData:", error);
      }
    };
    init();
  }, [diceValue]);
  
  /*  useEffect(() => {
    
    if (card1 === "Drácula") {
    }
    if (card2 === "Drácula") {
      setCard2ToShow("Dracula");
    }
    if (card6 === "Panteón") {
      setCard6ToShow("Panteon");
    } else if (card6 === " Vestíbulo") {
      setCard6ToShow("Vestibulo");
    } else if (card6 === "Salón") {
      setCard6ToShow("Salon");
    }
    if (card7 === "Panteón") {
      setCard7ToShow("Panteon");
    } else if (card7 === " Vestíbulo") {
      setCard7ToShow("Vestibulo");
    } else if (card7 === "Salón") {
      setCard7ToShow("Salon");
    }
    if (card8 === "Panteón") {
      setCard8ToShow("Panteon");
    } else if (card8 === " Vestíbulo") {
      setCard8ToShow("Vestibulo");
    } else if (card8 === "Salón") {
      setCard8ToShow("Salon");
    }
  }, [card1ToShow, card2ToShow ]);*/
  const normalize = (str) => {
    if (!str) return "";
    return String(str)
      .trim()
      .toLowerCase()
      .normalize("NFD")                   // Separa tildes (á → a + ◌́)
      .replace(/[\u0300-\u036f]/g, "")    // Elimina tildes y diacríticos
      .replace(/\s+/g, "")                // Elimina TODOS los espacios
      .replace(/[^a-z0-9]/g, "");         // Opcional: elimina caracteres raros (mejor NO, por "áma")
  };
  const showCards = () => {
    setPosition("relative");
    const normalizedCards = cards.map((cardName) => normalize(clues[cardName]));

    setCard0(normalizedCards[0]);
    setCard1(normalizedCards[1]);
    setCard2(normalizedCards[2]);
  };
  async function playShine() {
    try {
      if (shine) {
        // Si el sonido ya está cargado, reutilízalo
        await shine.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/card-appears.mp3")
      );
      setShine(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir shine:", error);
    }
  }
  const storeTurn = async (item) => {
    try {
      await AsyncStorage.setItem("turn", item);
    } catch (e) {
      console.log("error saving turn");
    }
  };
  const updateComputerData = async (card) => {
    if (!computerData) return;
    const updatedComputerData = {
      ...computerData,
      discardedCards: [...computerData.discardedCards, card],
    };
    try {
      await AsyncStorage.setItem("computerData", JSON.stringify(updatedComputerData));
      setComputerData(updatedComputerData);
    } catch (error) {
      console.error("Error al guardar computerData:", error);
    }
  };
  const playerMovement = (item) => {
    console.log('playData', playerData)
    if (playerData.currentLocation === room){ //mal
      router.push({
        pathname: "/room",
        params: { room: room, diceValue: diceValue  },
      });
    }else if (playerData.currentLocation === 'board'){
      router.push({
        pathname: "/dice",
      });
    }
  } 
  const showOcurrences = (item) => { //si item = room computerData RoomToGo debe cambiarse e ir a board
    playShine();
    updateComputerData(item);
    storeTurn("player");
    setText(`Has mostrado la carta ${item}`)
    setTimeout(() => {
      playerMovement(item);
    }, 2000)
    /*if (item === room) {
      router.push({
        pathname: "/board",
        params: { diceValue: diceValue, floor: computerData.floor },
      });
    }*/
  };
  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: 410,
          alignSelf: "center",
          zIndex: 1,
          left: 340,
        }}
      >
        <Text style={styles.yourCardsText}>{text}</Text>
        {cards.map((cardName, index) => {
          const cardConfig = [
            {
              source: card0,
              position: position,
              marginTop: cardMarginTop,
              borderRadius: 10,
            },
            {
              source: card1,
              position: position,
              marginTop: cardMarginTop,
              borderRadius: 10,
            },
            {
              source: card2,
              position: position,
              marginTop: cardMarginTop,
            },
          ][index] || { source: card0, resizeMode: "contain", extraStyle: {} };

          return (
            <Pressable
              style={styles.yourCardsContainer}
              key={index}
              onPress={() => showOcurrences(cardName)}
            >
              <ImageBackground
                style={[
                  styles.card,
                  {
                    position: "relative",
                    marginTop: index === 0 ? cardMarginTop : 10,
                    ...cardConfig.extraStyle,
                  },
                ]}
                source={cardConfig.source}
                resizeMode={cardConfig.resizeMode}
              >
                <Text style={[styles.cardName]}>{cardName}</Text>
              </ImageBackground>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  yourCardsContainer: {
    backgroundColor: "#6200ee",
    borderRadius: 5,
    width: 70,
    height: 120,
    flexDirection: "column",
    alignItems: "center",
    zIndex: 5
  },
  yourCardsText: {
    color: "white",
    padding: 2,
    fontSize: 10,
    backgroundColor: "#6200ee",
    borderRadius: 5,
    width: 70,

  },
  card: {
    width: 60,
    height: 90,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden", //necesario para aplicarse en ImageBackground
  },
  cardName: {
    color: "white",
    backgroundColor: "black",
    fontFamily: "Creepster-Regular",
    fontSize: 7,
    padding: 2,
  },
  cardText: {
    color: "white",
    fontFamily: "Creepster-Regular",
    fontSize: 15,
  },
});
