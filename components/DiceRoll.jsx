import React, { useEffect, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";


export function DiceRoll() {
  const [diceValue, setDiceValue] = useState(0);
  const [rotation] = useState(new Animated.Value(0));
  const [diceRoll, setDiceRoll] = useState(null);  
  const [playerToShow, setPlayerToShow] = useState(null);
  const [rooms, setRooms] = useState(['Laboratorio', 'Salón', 'Biblioteca', 'Alcoba', 'Cocheras', 'Vestíbulo', 'Panteón', 'Bodega']);
  const [computerData, setComputerData] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [floorToGo, setFloorToGo] = useState(null);
  const [turn, setTurn] = useState(null);
  const router = useRouter();
  useEffect(() => {
      if (diceValue === 0) return; // Ignora el valor inicial
      fetchData();
    }, [diceValue]);
  useEffect(() => {
    rollDice();
    diceRollSound();
  }, []);
  useEffect(() => { //audio
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
  
      // Liberación de sonidos al desmontar el componente
      return () => {
        if (diceRoll) {
          diceRoll.unloadAsync();
        }
      };
    },[diceRoll]);
     const getPlayerData = async () => {
    try {
      const value = await AsyncStorage.getItem("playerData");
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.log("error reading player data");
      return null;
    }
  };
  const getComputerData = async () => {
    try {
      const value = await AsyncStorage.getItem("computerData");
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.log("error reading computer data");
      return null;
    }
  };
  const getTurn = async () => {
    try {
      const turn = await AsyncStorage.getItem('turn');
      if (turn === null) {
        console.log('No turn found in AsyncStorage');
        return null; // O un valor predeterminado, como 'player'
      }
      return turn;
    } catch (e) {
      console.log('❌ Error reading turn:', e);
      //return null; // O manejar el error de otra manera
    }
  };
    async function diceRollSound() {
      try {
        if (diceRoll) {
          // Si el sonido ya está cargado, reutilízalo
          await diceRoll.replayAsync();
          return;
        }
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/dice.mp3")
        );
        setDiceRoll(sound);
        await sound.playAsync();
      } catch (error) {
        console.error("Error al reproducir diceRoll:", error);
      }
    }
    const fetchData = async () => {
      let playerTimer;
      let computerTimer;
    try {
      const [turnValue, computerValue, playerValue] = await Promise.all([
        getTurn(),
        getComputerData(),
        getPlayerData()
      ]);

      if (turnValue) {
        setTurn(turnValue);
      }

      if (computerValue) {
        setComputerData(computerValue);
      }

      if (playerValue) {
        setPlayerData(playerValue);

        // Usar los valores frescos directamente
        const currentPlayerName = turnValue === 'player' ? playerValue.name : computerValue.name;
        setPlayerToShow(currentPlayerName);

        if (turnValue === 'player') {
          console.log('Usando floor del jugador:', playerValue.floor);
          playerTimer = setTimeout(() => {
            router.push({
              pathname: "/board",
              params: { 
                diceValue: diceValue.toString(), 
                floor: playerValue.floor.toString()
              },
            });
          }, 2000);
        } else if (turnValue === 'computer') {
          computerTimer = setTimeout(() => {
            computerMovement(computerValue);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return () => {
      if (playerTimer) clearTimeout(playerTimer);
      if (computerTimer) clearTimeout(computerTimer);
    };
  };
  const rollDice = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);

    rotation.setValue(0);
    Animated.timing(rotation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const editFloor = async (floor) => {
    try {
      const storedData = await AsyncStorage.getItem("computerData");
      const currentData = storedData ? JSON.parse(storedData) : null;
      if (!currentData) return;

      const updatedComputerData = { ...currentData, floor: floor };
      await AsyncStorage.setItem(
        "computerData",
        JSON.stringify(updatedComputerData)
      );
      setComputerData(updatedComputerData);
    } catch (e) {
      console.log("❌ Error updating data:", e);
    }
  }
 const editRoomToGo = async (roomToGo) => {
    try {
      const storedData = await AsyncStorage.getItem("computerData");
      const currentData = storedData ? JSON.parse(storedData) : null;
      if (!currentData) return;
      const updatedComputerData = { ...currentData, roomToGo: roomToGo };
      await AsyncStorage.setItem(
        "computerData",
        JSON.stringify(updatedComputerData)
      );
      setComputerData(updatedComputerData);
    } catch (e) {
      console.log("❌ Error updating data:", e);
    }
  };
const computerRoomToGo = async (data) => {
  if (data.roomToGo === "") {
    const compare = (rooms || []).filter(
      (elemento) => !(data.computerCards || []).includes(elemento)
    );
    const randomRoomToGo = compare.length > 0
      ? compare[Math.floor(Math.random() * compare.length)]
      : null;

    if (randomRoomToGo) {
      await editRoomToGo(randomRoomToGo);
    }

    let floor = null;
    if (data.floor === "") {
      if (
        randomRoomToGo === "Laboratorio" ||
        randomRoomToGo === "Salón" ||
        randomRoomToGo === "Biblioteca" ||
        randomRoomToGo === "Alcoba"
      ) {
        await editFloor('firstFloor');
        floor = 'firstFloor';
        setFloorToGo('firstFloor');
      } else {
        await editFloor('ground');
        floor = 'ground';
        setFloorToGo('ground');
      }
    }

    return { roomToGo: randomRoomToGo, floor };
  }
  return { roomToGo: data.roomToGo, floor: data.floor };
};

const storeTurn = async (turn) => {
    try {
      await AsyncStorage.setItem("turn", turn);
    } catch (e) {
      console.log("error saving data");
    }
  };
const computerMovement = async (computerData) => {
  const { floor } = await computerRoomToGo(computerData); // Esperar los resultados
  router.push({
    pathname: "/board",
    params: { diceValue: diceValue.toString(), floor: floor }, // Usar floor calculado
  });
  storeTurn("player");
};

  const renderDiceFace = (value) => {
    switch (value) {
      case 1:
        return <View style={styles.dot} />;
      case 2:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      case 3:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      case 4:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotTopRight]} />
            <View style={[styles.dot, styles.dotBottomLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      case 5:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotTopRight]} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotBottomLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      case 6:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotTopRight]} />
            <View style={[styles.dot, styles.dotMiddleLeft]} />
            <View style={[styles.dot, styles.dotMiddleRight]} />
            <View style={[styles.dot, styles.dotBottomLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/table-back.png")}
    >
      <View style={styles.header}>
        <Text style={styles.header_text}>{playerToShow}</Text>
      </View>
      <Animated.View style={[styles.dice, { transform: [{ rotate: spin }] }]}>
        {renderDiceFace(diceValue)}
      </Animated.View>
    </ImageBackground>
  );
  }

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: {
    height: 80,
    width: 250,
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 300,
  },
  header_text: { fontFamily: "Creepster-Regular", fontSize: 40},
  dice: {
    width: 100,
    height: 100,
    backgroundColor: "#e3dac9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
    position: "relative",
    marginTop: 50,
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: "black",
    borderRadius: 10,
    position: "absolute",
  },
  dotTopLeft: { top: 10, left: 10 },
  dotTopRight: { top: 10, right: 10 },
  dotBottomLeft: { bottom: 10, left: 10 },
  dotBottomRight: { bottom: 10, right: 10 },
  dotMiddleLeft: { top: 40, left: 10 },
  dotMiddleRight: { top: 40, right: 10 },
});
