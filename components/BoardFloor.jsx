import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import {
  BackArrow,
  ForwardArrow,
  LeftArrow,
  RightArrow,
  SpiderIcon,
} from "./Icons";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShowCardsButton } from "./ShowCardsButton";
import { Audio } from "expo-av";
import fichaNely from '../assets/images/fichaNely.png';
import fichaDavid from '../assets/images/fichaDavid.png';

const playersMap = {
  Nely: fichaNely,
  David: fichaDavid,
};

export function BoardFloor({ diceValue }) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const [opacityBack, setOpacityBack] = useState(1);
  const [activateLoop, setActivateLoop] = useState(false); // Add this state
  const handleShowCardsPress = () => {
    !cardsDeployed ? playShowcards() : playHidecards();
    setOpacityBack(opacityBack === 1 ? 0.5 : 1);
  };
  const [loaded, error] = useFonts({
    "Creepster-Regular": require("../assets/fonts/Creepster-Regular.ttf"),
  });
  const [instructionsText, setInstructionsText] = useState(
    "Selecciona una casilla amarilla para moverte"
  );
  const [position, setPosition] = useState(0);
  const [room1Color, setRoom1Color] = useState("");
  const [room2Color, setRoom2Color] = useState("");
  const [room3Color, setRoom3Color] = useState("");
  const [room4Color, setRoom4Color] = useState("");
  const [disabledDice, setDisabledDice] = useState(true); // Estado para activar/desactivar el botón
  const [disabledRoom1, setDisabledRoom1] = useState(true);
  const [disabledRoom2, setDisabledRoom2] = useState(true);
  const [disabledRoom3, setDisabledRoom3] = useState(true);
  const [disabledRoom4, setDisabledRoom4] = useState(true);
  const [disabledSquare, setDisabledSquare] = useState(true);
  const [playerImage, setPlayerImage] = useState(null);
  const [stoneOccuped, setStoneOccuped] = useState(null);
  const scrollRef = useRef(null);
  const router = useRouter();
  const board = [ //no se visualiza la imagen del player
    {
      content: (
        stoneOccuped === 0 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          <>
            <ForwardArrow size={24} />
            <Text style={styles.stoneText}>Planta baja</Text>
          </>
        )
      ),
    },
    { content: (
        stoneOccuped === 1 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ),
    },
    { content: (
        stoneOccuped === 2 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 3 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    {
      content: (
        stoneOccuped === 4 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
           <>
          <Text style={styles.stoneText}>Laboratorio</Text>
          <LeftArrow />
        </>
        )
      ),
    },
    { content: (
        stoneOccuped === 5 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 6 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          <SpiderIcon />
        )
      ),  },
    { content: (
        stoneOccuped === 7 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 8 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 9 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 10 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 11 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    {
      content: (
        stoneOccuped === 12 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          <>
          <Text style={styles.stoneText}>Salón</Text>
          <RightArrow />
        </>
        )
      ),
    },
    { content: (
        stoneOccuped === 13 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 14 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 15 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 16 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 17 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 18 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 19 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 20 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    {
      content: (
        stoneOccuped === 21 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          <>
           <Text style={styles.stoneText}>Biblioteca</Text>
          <LeftArrow />
        </>
        )
      )
    },
    { content: (
        stoneOccuped === 22 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 23 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 24 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 25 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
        stoneOccuped === 26 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
         <SpiderIcon />
        )
      ),   },
    {
      content: (
        stoneOccuped === 27 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
         <>
          <Text style={styles.stoneText}>Alcoba</Text>
          <RightArrow />
        </>
        )
      ),   
    },
    { content: (
        stoneOccuped === 28 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
          null
        )
      ), },
    { content: (
      stoneOccuped === 29 ? (
          <Image
            style={styles.playerContainer}
            source={playerImage}
            resizeMode="cover"
          />
        ) : (
         <>
          <Text style={styles.stoneText}>Planta baja</Text>
          <BackArrow size={24} />
        </>
        )
      ),
    }
  ];
  const [colors, setColors] = useState(board.map(() => "#808080")); // Color inicial para cada stone
  const [borderColors, setBorderColors] = useState(board.map(() => "black"));
  const [rainSound, setRainSound] = useState(null);
  const [diceSound, setDiceSound] = useState(null);
  const [footSteps, setFootSteps] = useState(null);
  const [openDoor, setOpenDoor] = useState(null);
  const [showcards, setShowcards] = useState(null);
  const [hidecards, setHidecards] = useState(null);
  const [cardsDeployed, setCardsDeployed] = useState(null);
  const updateBorderColors = (storedValue, diceValue) => {
    setBorderColors((prevColors) => {
      const newColors = [...prevColors]; // Crear una copia del arreglo
      const sumIndex = Number(storedValue) + Number(diceValue);
      const diffIndex = Number(storedValue) - Number(diceValue);
      // Validar que los índices sean válidos
      if (sumIndex >= 0 && sumIndex < newColors.length) {
        newColors[sumIndex] =
          newColors[sumIndex] === "black" ? "yellow" : "black";
        //setDisabledSquare(false);
      }
      if (diffIndex >= 0 && diffIndex < newColors.length) {
        newColors[diffIndex] =
          newColors[diffIndex] === "black" ? "yellow" : "black";
        //setDisabledSquare(false);
      }
      return newColors;
    });
  };
  
useEffect(() => {
  playRainSound();
  
    const fetchPlayer = async () => {
    try {
      const storedPlayer = await getPlayer();
      
      console.log('Players available:', Object.keys(playersMap));
      console.log(`Image for ${storedPlayer}:`, playersMap[storedPlayer]);
      
      if (playersMap[storedPlayer]) {
        setPlayerImage(playersMap[storedPlayer]); // Esto funcionará con los IDs
        console.log(playerImage)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  fetchPlayer();
}, []);
  
  const toDiceRoll = () => {
    playDiceSound();
    router.push("/dice");
  };
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Liberación de sonidos al desmontar el componente
    return () => {
      if (rainSound) {
        console.log("Liberando rainSound");
        rainSound.unloadAsync();
      }
      if (diceSound) {
        console.log("Liberando diceSound");
        diceSound.unloadAsync();
      }
      if (footSteps) {
        console.log("Liberando footSteps");
        footSteps.unloadAsync();
      }
      if (openDoor) {
        console.log("Liberando openDoor");
        openDoor.unloadAsync();
      }
    };
  }, [diceSound, rainSound, footSteps, openDoor]);
  useEffect(() => {
    if (!activateLoop) return; // Only start if activated
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10, // Move up
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0, // Move back
          duration: 400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(500), // Shorter delay for more frequent bouncing; adjust or remove
      ])
    );
    loop.start();
    return () => loop.stop(); // Cleanup
  }, [activateLoop, bounceAnim]); // Depend on activateLoop to re-run when it changes
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const storedValue = await getPlayerPosition();
        console.log("Fetched stored value:", storedValue);        
        if (storedValue !== null) {
          const playerIndex = parseInt(storedValue, 10);
          // Hacer scroll a la posición del jugador
          // Usar setTimeout para asegurar que el ScrollView esté completamente renderizado
          setTimeout(() => {
            scrollToPlayerPosition(playerIndex);
          }, 100); // Pequeño delay para asegurar renderizado

          setPosition(playerIndex); // Actualizar posición local
          setStoneOccuped(playerIndex);

          // ... resto de tu lógica existente
          /*const newColors = [...colors];
          newColors[playerIndex] =
            newColors[playerIndex] === "#FF6347" ? "#808080" : "#FF6347";*/
          updateBorderColors(playerIndex, diceValue);
          //setColors(newColors);

          // Lógica de habitaciones...
          if (
            (playerIndex <= 4 && playerIndex + Number(diceValue) > 4) ||
            (playerIndex >= 4 && playerIndex - Number(diceValue) < 4)
          ) {
            setRoom1Color("yellow");
            setDisabledRoom1(false);
          }
          if (
            (playerIndex <= 21 && playerIndex + Number(diceValue) > 21) ||
            (playerIndex >= 21 && playerIndex - Number(diceValue) < 21)
          ) {
            setRoom2Color("yellow");
            setDisabledRoom2(false);
          }
          if (
            (playerIndex <= 12 && playerIndex + Number(diceValue) > 12) ||
            (playerIndex >= 12 && playerIndex - Number(diceValue) < 12)
          ) {
            setRoom3Color("yellow");
            setDisabledRoom3(false);
          }
          if (
            (playerIndex <= 27 && playerIndex + Number(diceValue) > 27) ||
            (playerIndex >= 27 && playerIndex - Number(diceValue) < 27)
          ) {
            setRoom4Color("yellow");
            setDisabledRoom4(false);
          }
          // ... resto de condiciones de habitaciones
        }
      } catch (error) {
        console.error("Error fetching position:", error);
      }
    };

    fetchPosition();
  }, [diceValue]); // Agregar diceValue como dependencia si cambia
  useEffect(() => {
    if (position !== null && position !== undefined) {
      // Hacer scroll cuando cambia la posición local
      scrollToPlayerPosition(position);

      /*const newColors = [...colors];
      newColors[position] =
        newColors[position] === "#FF6347" ? "#808080" : "#9cf1a7ff";
      setColors(newColors);*/
    }
  }, [position]);
  const scrollToPlayerPosition = (playerIndex) => {
    if (!scrollRef.current || playerIndex === null || isNaN(playerIndex))
      return;

    const STONE_HEIGHT = 61;
    const targetOffset = playerIndex * STONE_HEIGHT;

    // Obtener las medidas del ScrollView para centrar
    scrollRef.current.getScrollResponder()?.scrollTo({
      y: Math.max(0, targetOffset - 300), // 300px de "padding" superior para centrar
      animated: true,
    });
  };
  async function playRainSound() {
    console.log("Cargando rainSound");
    try {
      if (rainSound) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo rainSound existente");
        await rainSound.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/wolf-howl.mp3")
      );
      setRainSound(sound);
      console.log("Reproduciendo rainSound");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir rainSound:", error);
    }
  }
  async function playFootSteps() {
    console.log("Cargando footSteps");
    try {
      if (footSteps) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo footSteps existente");
        await footSteps.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/footsteps.mp3")
      );
      setFootSteps(sound);
      console.log("Reproduciendo footSteps");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir footSteps:", error);
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
  async function playDiceSound() {
    console.log("Cargando diceSound");
    try {
      if (diceSound) {
        // Si el sonido ya está cargado, reutilízalo
        console.log("Reproduciendo diceSound existente");
        await diceSound.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/dice.mp3")
      );
      setDiceSound(sound);
      console.log("Reproduciendo diceSound");
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir diceSound:", error);
    }
  }
  const getPlayer = async () => {
    try {
      const value = await AsyncStorage.getItem("player");
      return value;
    } catch (e) {
      console.log("error reading data");
      return null;
    }
  };
  const getPlayerPosition = async () => {
    try {
      const value = await AsyncStorage.getItem("position");
      return value;
    } catch (e) {
      console.log("error reading data");
      return null;
    }
  };
  const storePlayerPosition = async (position) => {
    try {
      await AsyncStorage.setItem("position", position);
    } catch (e) {
      console.log("error saving data");
    }
  };
  const stoneClicked = (index) => {
    //se guarda la position al clickar
    setStoneOccuped(index);
    playFootSteps();
    setInstructionsText("Tira el dado para continuar");
    setPosition(index);
    storePlayerPosition(index.toString());
    setActivateLoop(true);
    setDisabledDice(false); // Enable the button
    setDisabledSquare(true); // Disable squares after selection
    if (index === 0 || index === 29) {
      router.push({
        pathname: "/entry",
      });
    }
    if (index === 6) {
      storePlayerPosition("26");
      setPosition(26);
      setStoneOccuped(26);
    }
    if (index === 26) {
      storePlayerPosition("6");
      setPosition(6);
      setStoneOccuped(6);
    }
  };
  const roomClicked = (room) => {
    playOpenDoor();
    setDisabledRoom1(true);
    setDisabledRoom2(true);
    setDisabledRoom3(true);
    setDisabledRoom4(true);
    setRoom1Color("white");
    setRoom2Color("white");
    setRoom3Color("white");
    setRoom4Color("white");
    setDisabledDice(true);
    setDisabledSquare(true); // Disable squares after selection
    router.push({
      pathname: "/room",
      params: { room: room },
    });
  };
  return (
    <>
      <ShowCardsButton onPress={handleShowCardsPress} />
      <ImageBackground
        style={[styles.superContainer, { opacity: opacityBack }]}
        source={require("../assets/images/boardImages/boardBack.png")}
        resizeMode="cover"
      >
        <View style={styles.instructionsCloud}>
          <Text style={styles.text}>{instructionsText}</Text>
        </View>
        <Animated.View
          style={{
            position: "absolute",
            bottom: 690,
            alignSelf: "center",
            transform: [{ translateY: bounceAnim }],
            zIndex: 1,
            left: 20,
          }}
        >
          <Pressable
            disabled={disabledDice} // Disable button if not activated
            style={{
              backgroundColor: "#6200ee",
              padding: 16,
              borderRadius: 50,
              elevation: 5,
            }}
            onPress={toDiceRoll}
          >
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={require("../assets/images/dice.png")}
              resizeMode="cover"
            />
          </Pressable>
        </Animated.View>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          // Opcional: vincular con scrollAnim para más control
          // contentOffset={{ x: 0, y: scrollAnim }}
        >
          <View style={styles.container}>
            <View style={styles.leftRoomsContainer}>
              <Pressable
                disabled={disabledRoom1}
                onPress={() => roomClicked("Laboratorio")}
                style={[styles.room1Container, { borderColor: room1Color }]}
              >
                <ImageBackground
                  style={styles.room}
                  source={require("../assets/images/boardImages/Labo.png")}
                />
              </Pressable>
              <Pressable
                disabled={disabledRoom2}
                onPress={() => roomClicked("Biblioteca")}
                style={[styles.room2Container, { borderColor: room2Color }]}
              >
                <ImageBackground
                  style={styles.room}
                  source={require("../assets/images/boardImages/Library.png")}
                />
              </Pressable>
            </View>
            <View style={styles.stonesContainer}>
              {board.map((stone, index) => (
                <Pressable
                  disabled={borderColors[index] !== "yellow"} // Disable if not highlighted
                  key={index}
                  style={[
                    styles.stone,
                    {
                      backgroundColor: colors[index],
                      borderColor: borderColors[index],
                    },
                  ]}
                  onPress={() => stoneClicked(index)}
                >
                  {stone.content}
                </Pressable>
              ))}
            </View>
            <View style={styles.rightRoomsContainer}>
              <Pressable
                disabled={disabledRoom3}
                onPress={() => roomClicked("Salon")}
                style={[styles.room3Container, { borderColor: room3Color }]}
              >
                <ImageBackground
                  style={styles.room}
                  source={require("../assets/images/boardImages/Lounge.png")}
                />
              </Pressable>
              <Pressable
                disabled={disabledRoom4}
                onPress={() => roomClicked("Alcoba")}
                style={[styles.room4Container, { borderColor: room4Color }]}
              >
                <ImageBackground
                  style={styles.room}
                  source={require("../assets/images/boardImages/Bedroom.png")}
                />
              </Pressable>
            </View>
          </View>
        </Animated.ScrollView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    padding: 7,
  },
  container: {
    alignItems: "center",
    height: "100%",
    width: "100%",
    flexDirection: "row",
    marginTop: 20,
  },
  stonesContainer: {
    marginBottom: 100,
    padding: 10,
  },
  stone: {
    width: 85,
    height: 60,
    backgroundColor: "grey",
    marginBottom: 1,
    borderRadius: 5,
    alignItems: "center",
    padding: 1,
    justifyContent: "center",
    borderWidth: 4,
  },
  stoneText: {
    fontFamily: "Creepster-Regular",
    fontSize: 11,
  },
  leftRoomsContainer: {
    flexDirection: "column",
  },
  room1Container: {
    borderWidth: 4,
    borderColor: "black",
    height: 258,
    marginBottom: 860,
    width: 133,
  },
  room2Container: {
    borderWidth: 4,
    borderColor: "black",
    height: 258,
    width: 133,
    marginBottom: 290,
  },
  rightRoomsContainer: {
    flexDirection: "column",
    marginTop: 100,
  },
  room3Container: {
    borderWidth: 4,
    borderColor: "black",
    height: 258,
    width: 133,
    marginTop: 400,
  },
  room4Container: {
    borderWidth: 4,
    borderColor: "black",
    height: 258,
    width: 133,
    marginTop: 550,
  },
  room: {
    height: 250,
    width: 125,
  },
  diceContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  dice: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  instructionsCloud: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
    marginTop: 170,
  },
  text: {
    fontSize: 18,
    fontFamily: "Creepster-Regular",
    textAlign: "center",
  },
  playerContainer: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'blue',
    width: 50,
    height: 50

  }
});
