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

const playersMap = {
  Nely: require("../assets/images/fichaNely.png"),
  David: require("../assets/images/fichaDavid.png"),
};

export function FirstFloor({ diceValue }) {
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
  //const [position, setPosition] = useState(0);
  const [groundNorthColor, setGroundNorthColor] = useState(null);
  const [groundSouthColor, setGroundSouthColor] = useState(null);
  const [room1Color, setRoom1Color] = useState(null);
  const [room2Color, setRoom2Color] = useState(null);
  const [room3Color, setRoom3Color] = useState(null);
  const [room4Color, setRoom4Color] = useState(null);
  const [disabledDice, setDisabledDice] = useState(false); // Estado para activar/desactivar el botón
  const [disabledRoom1, setDisabledRoom1] = useState(true);
  const [disabledRoom2, setDisabledRoom2] = useState(true);
  const [disabledRoom3, setDisabledRoom3] = useState(true);
  const [disabledRoom4, setDisabledRoom4] = useState(true);
  const [disabledSquare, setDisabledSquare] = useState(true);
  const [disabledNorth, setDisabledNorth] = useState(true);
  const [disabledSouth, setDisabledSouth] = useState(true);
  const [playerImage, setPlayerImage] = useState(null);
  const [computerImage, setComputerImage] = useState(null);
  const [stoneOccuped, setStoneOccuped] = useState(0);
  const [stoneComputerOccuped, setStoneComputerOccuped] = useState(null);
  const [computerData, setComputerData] = useState({});
  const [computerFloor, setComputerFloor] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef(null);
  const router = useRouter();
  const board = Array.from({ length: 30 }, (_, index) => ({
    isStart: index === 0,
    isEnd: index === 29,
    isLab: index === 4,
    isLounge: index === 12,
    isLibrary: index === 21,
    isBedroom: index === 27,
    isSpider: index === 6 || index === 26,
    content: index, // solo para debug, luego lo quitas
  }));
  const [colors, setColors] = useState(board.map(() => "#808080")); // Color inicial para cada stone
  const [borderColors, setBorderColors] = useState(board.map(() => "black"));
  const [rainSound, setRainSound] = useState(null);
  const [diceSound, setDiceSound] = useState(null);
  const [footSteps, setFootSteps] = useState(null);
  const [openDoor, setOpenDoor] = useState(null);
  const [jump, setJump] = useState(null);
  const [showcards, setShowcards] = useState(null);
  const [hidecards, setHidecards] = useState(null);
  const [playerData, setPlayerData] = useState({});
  const [cardsDeployed, setCardsDeployed] = useState(null);
  const [computerPosition, setComputerPosition] = useState(null);
  const [turn, setTurn] = useState(null);
  const [leftDisplacement, setLeftDisplacement] = useState(0);
  const [playerInRoom1, setPlayerInRoom1] = useState(false);
  const [playerInRoom2, setPlayerInRoom2] = useState(false);
  const [playerInRoom3, setPlayerInRoom3] = useState(false);
  const [playerInRoom4, setPlayerInRoom4] = useState(false);
  const [computerInRoom1, setComputerInRoom1] = useState(false);
  const [computerInRoom2, setComputerInRoom2] = useState(false);
  const [computerInRoom3, setComputerInRoom3] = useState(false);
  const [computerInRoom4, setComputerInRoom4] = useState(false);
  useEffect(() => {
    console.log("computerData", computerData)
    console.log("playerData", playerData)
  }, [computerData, playerData])
  useEffect(() => {
  const init = async () => {
    try {
      const turnValue = await getTurn();
      if (!turnValue) return;

      setTurn(turnValue);

      const [playerValue, computerValue] = await Promise.all([
        getPlayerData(),
        getComputerData(),
      ]);

      // ========= PLAYER =========
      if (playerValue?.position !== undefined) {
        setPlayerData(playerValue);
        setStoneOccuped(playerValue.position);
        scrollToPlayerPosition(playerValue.position);
      }

      // ========= COMPUTER =========
      let computerIndex = null;

      if (computerValue) {
        setComputerData(computerValue);
        if (computerValue.floor === "firstFloor") {
          computerIndex = Number(computerValue.position);
          setIsVisible(true);
          setStoneComputerOccuped(computerIndex);
          setComputerPosition(computerIndex);
          scrollToComputerPosition(computerIndex);
        }
      }

      // ========= PLAYER TURN =========
      if (turnValue === "player") {
        // Si el jugador no tiene dado → no podemos mostrar casillas amarillas
        if (!diceValue) return;

        if (playerValue?.position !== undefined) {
          updateBorderColors(playerValue.position, diceValue);
          setInstructionsText("Selecciona una casilla amarilla para moverte");
          fetchPosition();
        }
      }

      // ========= COMPUTER TURN =========
      if (turnValue === "computer" && computerIndex !== null) {
        setInstructionsText(`${computerValue.name} está moviendo...`);

        // MUY IMPORTANTE: NO BLOQUEAR EL MOVIMIENTO POR diceValue === 0
        setTimeout(() => {
          computerMovement(computerValue);
        }, 800);
      }

      playRainSound();
      fetchPlayer(playerValue);

    } catch (error) {
      console.error("Error en init FirstFloor:", error);
    }
  };

  init();
}, []);

  useEffect(() => {
    if (!diceValue) return;
    // Solo actualiza bordes amarillos, NO la posición
    if (turn === 'player') {
      updateBorderColors(playerData.position, diceValue);
    }
  }, [diceValue, turn, playerData.position]);
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
        rainSound.unloadAsync();
      }
      if (diceSound) {
        diceSound.unloadAsync();
      }
      if (footSteps) {
        footSteps.unloadAsync();
      }
      if (openDoor) {
        openDoor.unloadAsync();
      }
      if (jump) {
        jump.unloadAsync();
      }
    };
  }, [diceSound, rainSound, footSteps, openDoor, jump]);
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
      if (computerData.currentLocation === "Laboratorio"){
        setPlayerInRoom1(true);
      }else if (computerData.currentLocation === "Salón"){
        setPlayerInRoom3(true);
      }else if (computerData.currentLocation === "Biblioteca"){
        setPlayerInRoom2(true);
      }else if (computerData.currentLocation === "Alcoba"){
        setPlayerInRoom4(true);
      }
  }, [computerData.currentLocation])
  useEffect(() => {
      if (playerData.currentLocation === "Laboratorio"){
        setPlayerInRoom1(true);
      }else if (playerData.currentLocation === "Salón"){
        setPlayerInRoom3(true);
        
      }else if (playerData.currentLocation === "Biblioteca"){
        setPlayerInRoom2(true);
        
      }else if (playerData.currentLocation === "Alcoba"){
        setPlayerInRoom4(true);
      }
  }, [playerData.currentLocation])
  const fetchPlayer = async (data) => {
    try {
      if (!data?.name) return;
      if (data.name === "Detective Nely") {
        setComputerImage(playersMap["David"]);
      } else if (data.name === "Inspector David") {
        setComputerImage(playersMap["Nely"]);
      }
      const playerKey = data.name === "Detective Nely" ? "Nely" : "David";
      if (playersMap[playerKey]) {
        setPlayerImage(playersMap[playerKey]);
      }
    } catch (error) {
      console.error("Error en fetchPlayer:", error);
    }
  };
 const fetchPosition = async () => {
    try {
      const storedValue = await getPlayerData();
      if (storedValue !== null) {
        const playerIndex = storedValue.position;
        setTimeout(() => {
          scrollToPlayerPosition(playerIndex);
        }, 100);
        //////setPosition(playerIndex);
        setStoneOccuped(playerIndex);
        // Actualizar colores de los bordes
        //updateBorderColors(playerIndex, diceValue);
        // Lógica de habitaciones
        if (
          (playerIndex <= 4 && playerIndex + Number(diceValue) > 4) ||
          (playerIndex >= 4 && playerIndex - Number(diceValue) < 4)
        ) {
          setRoom1Color("yellow");
          setDisabledRoom1(false);
        } else {
          setRoom1Color(null);
          setDisabledRoom1(true);
        }
        if (
          (playerIndex <= 21 && playerIndex + Number(diceValue) > 21) ||
          (playerIndex >= 21 && playerIndex - Number(diceValue) < 21)
        ) {
          setRoom2Color("yellow");
          setDisabledRoom2(false);
        } else {
          setRoom2Color(null);
          setDisabledRoom2(true);
        }
        if (
          (playerIndex <= 12 && playerIndex + Number(diceValue) > 12) ||
          (playerIndex >= 12 && playerIndex - Number(diceValue) < 12)
        ) {
          setRoom3Color("yellow");
          setDisabledRoom3(false);
        } else {
          setRoom3Color(null);
          setDisabledRoom3(true);
        }
        if (
          (playerIndex <= 27 && playerIndex + Number(diceValue) > 27) ||
          (playerIndex >= 27 && playerIndex - Number(diceValue) < 27)
        ) {
          setRoom4Color("yellow");
          setDisabledRoom4(false);
        } else {
          setRoom4Color(null);
          setDisabledRoom4(true);
        }
      }
    } catch (error) {
      console.error("Error fetching position:", error);
    }
  };
  const getPlayerData = async () => {
    try {
      const value = await AsyncStorage.getItem("playerData");
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.log("error reading player data");
      return null;
    }
  };
  const updateBorderColors = (storedValue, diceValue) => {
    setBorderColors((prevColors) => {
      const newColors = [...prevColors]; // Crear una copia del arreglo
      const sumIndex = Number(storedValue) + Number(diceValue);
      const diffIndex = Number(storedValue) - Number(diceValue);
      newColors.fill("black");
      if (sumIndex > 0 && sumIndex < newColors.length - 1) {
        newColors[sumIndex] = "yellow";
      }
      if (diffIndex > 0 && diffIndex < newColors.length - 1) {
        newColors[diffIndex] = "yellow";
      }
      if (sumIndex <= 0 || diffIndex <= 0) {
        newColors[0] = "yellow";
        setGroundNorthColor("yellow");
        setDisabledNorth(false);
      } else {
        setGroundNorthColor(null);
        setDisabledNorth(true);
      }
      // Resaltar casilla 29 si el movimiento lleva a >= 29
      if (sumIndex >= 29 || diffIndex >= 29) {
        newColors[29] = "yellow";
        setGroundSouthColor("yellow");
        setDisabledSouth(false);
      } else {
        setGroundSouthColor(null);
        setDisabledSouth(true);
      }
      return newColors;
    });
  };
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
  const scrollToComputerPosition = (computerIndex) => {
    if (!scrollRef.current || computerIndex === null || isNaN(computerIndex))
      return;

    const STONE_HEIGHT = 61;
    const targetOffset = computerIndex * STONE_HEIGHT;

    // Obtener las medidas del ScrollView para centrar
    scrollRef.current.getScrollResponder()?.scrollTo({
      y: Math.max(0, targetOffset - 300), // 300px de "padding" superior para centrar
      animated: true,
    });
  };
  async function playRainSound() {
    try {
      if (rainSound) {
        await rainSound.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/wolf-howl.mp3")
      );
      setRainSound(sound);

      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir rainSound:", error);
    }
  }
  const getComputerData = async () => {
    try {
      const value = await AsyncStorage.getItem("computerData");
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.log("error reading computer data");
      return null;
    }
  };
  async function playFootSteps() {
    try {
      if (footSteps) {
        await footSteps.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/footsteps.mp3")
      );
      setFootSteps(sound);

      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir footSteps:", error);
    }
  }
  async function playOpenDoor() {
    try {
      if (openDoor) {
        await openDoor.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/open-door.mp3")
      );
      setOpenDoor(sound);

      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir openDoor:", error);
    }
  }
  async function playJump() {
    try {
      if (jump) {
        await jump.replayAsync();
        return;
      }
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/jump.mp3")
      );
      setJump(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir jump:", error);
    }
  }
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
  async function playDiceSound() {
    try {
      if (diceSound) {
        await diceSound.replayAsync();
        return;
      }
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/dice.mp3")
      );
      setDiceSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir diceSound:", error);
    }
  }
  const storeTurn = async (item) => {
    try {
      await AsyncStorage.setItem("turn", item);
    } catch (e) {
      console.log("error saving turn");
    }
  };
  const editPositionPlayer = async (index) => {
    try {
      const existing = await getPlayerData(); // siempre cargamos desde AsyncStorage

      const updatedPlayerData = {
        ...(existing || playerData || {}),    // usa lo que exista
        position: index,
      };

      await AsyncStorage.setItem("playerData", JSON.stringify(updatedPlayerData));
      setPlayerData(updatedPlayerData);

    } catch (e) {
      console.log("error updating player position", e);
    }
  };

  const editPositionComputer = async (index) => { //no se actualiza el dato con el dado lanzado
    try {
      const existing = await getComputerData(); // siempre cargamos desde AsyncStorage

      const updatedComputerData = {
        ...(existing || computerData || {}),    // usa lo que exista
        position: index,
      };

      await AsyncStorage.setItem("computerData", JSON.stringify(updatedComputerData));
      setComputerData(updatedComputerData);

    } catch (e) {
      console.log("error updating computer position", e);
    }
  };

  const editLocationPlayer = async (newLocation) => { 
    setPlayerData(prev => {
      const updated = {
        ...(prev || {}),                
        currentLocation: newLocation,
      };

      // Guardamos en AsyncStorage de forma asíncrona (no bloquea el setState)
      AsyncStorage.setItem("playerData", JSON.stringify(updated)).catch(err =>
        console.error("Error guardando playerData:", err)
      );

      return updated;
    });
  };
  const editLocationComputer = async (newLocation) => {
    setComputerData(prev => {
      const updated = {
        ...(prev || {}),                
        currentLocation: newLocation,
      };

      // Guardamos en AsyncStorage de forma asíncrona (no bloquea el setState)
      AsyncStorage.setItem("computerData", JSON.stringify(updated)).catch(err =>
        console.error("Error guardando computerData:", err)
      );

      return updated;
    });
  };
  const toComputerDiceRoll = () => {
    setComputerFloor(computerData.floor);
    playDiceSound();
    router.push({
      pathname: "/dice",
    });
  };
  const toDiceRoll = () => {
    playDiceSound();
    router.push({
      pathname: "/dice",
    });
  };
  const getTurn = async () => {
    try {
      const turn = await AsyncStorage.getItem("turn");
      if (turn === null) {
        console.log("No turn found in AsyncStorage");
        return null; // O un valor predeterminado, como 'player'
      }
      //setTurn(turn);
      return turn;
    } catch (e) {
      console.log("❌ Error reading turn:", e);
      return null; // O manejar el error de otra manera
    }
  };
  const computerMovement = (data) => {
    console.log('data', data)
    const currentPos = Number(data.position);
    const dice = Number(diceValue);
    const targetRoomPos = {
      Laboratorio: 4,
      Biblioteca: 21,
      Salón: 12,
      Alcoba: 27,
    };
    const roomToGo = data.roomToGo;
    const targetPos = targetRoomPos[roomToGo];
    if (!targetPos) {
      console.error("Habitación objetivo desconocida:", roomToGo);
      return;
    }
    const forwardPos = currentPos + dice;
    const backwardPos = currentPos - dice;
    // Calcular distancia a la habitación objetivo
    const distForward = Math.abs(forwardPos - targetPos);
    const distBackward = Math.abs(backwardPos - targetPos);
    const distStay = Math.abs(currentPos - targetPos); // por si no se puede mover
    let chosenPos = currentPos;
    // ¿Puede llegar exactamente o muy cerca retrocediendo?
    if (backwardPos >= 0 && distBackward < distForward && distBackward <= distStay + 1) {
      chosenPos = backwardPos;
    } 
    // ¿Puede llegar exactamente o muy cerca avanzando?
    else if (forwardPos < 30 && distForward < distBackward && distForward <= distStay + 1) {
      chosenPos = forwardPos;
    }
    // Si no mejora, quédate quieto o avanza si es mejor que retroceder
    else if (forwardPos < 30) {
      chosenPos = forwardPos;
    }
    else if (backwardPos >= 0) {
      chosenPos = backwardPos;
    }

    // ¿Llegó o pasó por la casilla de la habitación?
    const positionsToCheck = [];
    if (currentPos < chosenPos) {
      for (let i = currentPos + 1; i <= chosenPos; i++) positionsToCheck.push(i);
    } else if (currentPos > chosenPos) {
      for (let i = currentPos - 1; i >= chosenPos; i--) positionsToCheck.push(i);
    }

    // Si pasa o llega exactamente a la casilla de la habitación → entra
    if (positionsToCheck.includes(targetPos) || chosenPos === targetPos) {
      console.log(`¡Computadora entra a ${roomToGo}!`);
      setTimeout(() => roomClickedByComputer(roomToGo), 1200);
      return;
    }
    // Movimiento normal por el tablero
    console.log(`Computadora se mueve a casilla ${chosenPos}`);
    stoneClickedByComputer(chosenPos);

    setTimeout(() => {
      scrollToComputerPosition(chosenPos);
      setInstructionsText("Te toca tirar el dado!");
    }, 800);
  };
  const stoneClickedByComputer = (index) => {
    setStoneComputerOccuped(index);
    editLocationComputer("board");
    editPositionComputer(index);
    if (index === 6 || index === 26) {
      setTimeout(() => playJump(), 100);
    } else {
      playFootSteps();
    }
    setActivateLoop(true);
    setDisabledSquare(true);
    setDisabledDice(false); // Enable dice for player
    if (index === 6) {
      editPositionComputer(26);
      setStoneComputerOccuped(26);
      scrollToComputerPosition(26);
    }
    if (index === 26) {
      editPositionComputer(6);
      setStoneComputerOccuped(6);
      scrollToComputerPosition(6);
    }
    if (index === 0 || index === 29) {
    //setear cambio de planta y roomToGo en computerData...
    }
    storeTurn("player");
  };
  const stoneClicked = (index) => {
    storeTurn("computer");
    setStoneOccuped(index);
    editLocationPlayer("board");
    if (index === 6 || index === 26) {
      setTimeout(() => {
        playJump();
      }, 100);
    } else {
      playFootSteps();
    }
    setInstructionsText("Turno para otro investigador");
    editPositionPlayer(index);
    setDisabledSquare(true); // Disable squares after selection
    if (index === 0 || index === 29) {
      setGroundNorthColor(null);
      setGroundSouthColor(null);
      setDisabledNorth(true);
      setDisabledSouth(true);
      router.push({
        pathname: "/entry",
      });
    }
    if (index === 6) {
      editPositionPlayer(26);
      setStoneOccuped(26);
      scrollToPlayerPosition(26);
    }
    if (index === 26) {
      editPositionPlayer(6);
      setStoneOccuped(6);
      scrollToPlayerPosition(6);
    }
    setTimeout(() => {
      toComputerDiceRoll();
    }, 1000);
  };
  const roomClicked = (room) => {
    editLocationPlayer(room);
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
      params: { room: room, diceValue: diceValue },
    });
    
  };
  const roomClickedByComputer = (room) => {
    editLocationComputer(room);
    playOpenDoor();
    setDisabledDice(true);
    setDisabledSquare(true); // Disable squares after selection
    router.push({
      pathname: "/room",
      params: { room: room, floor: 'firstFloor', diceValue: diceValue  },
    });
  };
  return (
    <>
      {turn === "player" ? (
        <ShowCardsButton onPress={handleShowCardsPress} />
      ) : null}
      <ImageBackground
        style={[styles.superContainer, { opacity: opacityBack }]}
        source={require("../assets/images/boardImages/boardBack.png")}
        resizeMode="cover"
      >
        <View style={styles.instructionsCloud}>
          <Text style={styles.text}>{instructionsText}</Text>
        </View>
        {turn === "computer" ? (
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
        ) : null}
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
                >
                  {playerInRoom1 ? <Image
                    style={[styles.playerContainer, {marginTop: 60, marginLeft: 10}]}
                    source={playerImage}
                    resizeMode="cover"
                  /> : null }
                  {computerInRoom1 ? <Image
                    style={[styles.computerContainer, {marginTop: 80, marginLeft: 40}]}
                    source={playerImage}
                    resizeMode="cover"
                  /> : null }
              </ImageBackground>
              </Pressable>
              <Pressable
                disabled={disabledRoom2}
                onPress={() => roomClicked("Biblioteca")}
                style={[styles.room2Container, { borderColor: room2Color }]}
              >
                <ImageBackground
                  style={styles.room}
                  source={require("../assets/images/boardImages/Library.png")}
                >
                  {playerInRoom2 ? <Image
                    style={[styles.playerContainer, {marginTop: 60, marginLeft: 10}]}
                    source={playerImage}
                    resizeMode="cover"
                  /> : null }
                  {computerInRoom2 ? <Image
                    style={[styles.computerContainer, {marginTop: 80, marginLeft: 40}]}
                    source={playerImage}
                    resizeMode="cover"
                  /> : null }
                </ImageBackground>
              </Pressable>
            </View>
            <View style={styles.stonesContainer}>
              {board.map((stone, index) => {
                const playerHere = playerData.position === index;
                const computerHere = computerData.position === index && isVisible;

                return (
                  <Pressable
                    key={index}
                    disabled={borderColors[index] !== "yellow"}
                    style={[
                      styles.stone,
                      {
                        backgroundColor: colors[index],
                        borderColor: borderColors[index],
                      },
                    ]}
                    onPress={() => stoneClicked(index)}
                  >
                    {/* MOSTRAR JUGADORES */}
                    {(playerHere || computerHere) ? (
                      <View style={styles.playersContainer}>
                        {playerHere && playerImage && (
                          <Image style={styles.playerContainer} source={playerImage} />
                        )}
                        {computerHere && computerImage && (
                          <Image
                            style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                            source={computerImage}
                          />
                        )}
                      </View>
                    ) : (
                      <>
                        {/* ICONOS ESPECIALES */}
                        {stone.isStart && (
                          <>
                            <ForwardArrow size={24} />
                            <Text style={styles.stoneText}>Planta baja</Text>
                          </>
                        )}
                        {stone.isEnd && (
                          <>
                            <ForwardArrow size={24} />
                            <Text style={styles.stoneText}>Planta baja</Text>
                          </>
                        )}
                        {stone.isLab && (
                          <>
                            <Text style={styles.stoneText}>Laboratorio</Text>
                            <LeftArrow />
                          </>
                        )}
                        {stone.isLounge && (
                          <>
                            <Text style={styles.stoneText}>Salón</Text>
                            <RightArrow />
                          </>
                        )}
                        {stone.isLibrary && (
                          <>
                            <Text style={styles.stoneText}>Biblioteca</Text>
                            <LeftArrow />
                          </>
                        )}
                        {stone.isBedroom && (
                          <>
                            <Text style={styles.stoneText}>Alcoba</Text>
                            <RightArrow />
                          </>
                        )}
                        {stone.isSpider && <SpiderIcon />}
                      </>
                    )}
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.rightRoomsContainer}>
              <Pressable
                disabled={disabledRoom3}
                onPress={() => roomClicked("Salón")}
                style={[styles.room3Container, { borderColor: room3Color }]}
              >
                <ImageBackground
                  style={styles.room}
                  source={require("../assets/images/boardImages/Lounge.png")}
                >
                  {playerInRoom3 ? <Image
                    style={[styles.playerContainer, {marginTop: 60, marginLeft: 10}]}
                    source={playerImage}
                    resizeMode="cover"
                  /> : null}
                  {computerInRoom3 ? <Image
                    style={[styles.computerContainer, {marginTop: 80, marginLeft: 40}]}
                    source={playerImage}
                    resizeMode="cover"
                  /> : null }
                </ImageBackground>
              </Pressable>
              <Pressable
                disabled={disabledRoom4}
                onPress={() => roomClicked("Alcoba")}
                style={[styles.room4Container, { borderColor: room4Color }]}
              >
                <ImageBackground
                  style={styles.room}
                  source={require("../assets/images/boardImages/Bedroom.png")}
                >
                  {playerInRoom4 ? <Image
                    style={[styles.playerContainer, {marginTop: 60, marginLeft: 10}]}
                    source={playerImage}
                    resizeMode="cover"
                  /> : null}
                  {computerInRoom4 ? <Image
                    style={[styles.computerContainer, {marginTop: 80, marginLeft: 40}]}
                    source={playerImage}
                    resizeMode="cover"
                  /> : null }
                </ImageBackground>
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
  playersContainer: {
    flexDirection: "row",
    zIndex: 2,
    justifyContent: "space-evenly",
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
    borderColor: "lightgreen",
    width: 50,
    height: 50,
  },
  computerContainer: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "blue",
    width: 50,
    height: 50,
    zIndex: -2,
    marginLeft: -23,
  },
});
