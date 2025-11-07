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
import { store } from "expo-router/build/global-state/router-store";

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
  const [position, setPosition] = useState(0);
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
  const board = [
    {
      content: (
        <>
          {stoneOccuped === 0 || stoneComputerOccuped === 0 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 0 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 0 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <>
              <ForwardArrow size={24} />
              <Text style={styles.stoneText}>Planta baja</Text>
            </>
          )}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 1 || stoneComputerOccuped === 1 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 1 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 1 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 2 || stoneComputerOccuped === 2 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 2 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 2 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 3 || stoneComputerOccuped === 3 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 3 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 3 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 4 || stoneComputerOccuped === 4 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 4 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 4 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <>
              <Text style={styles.stoneText}>Laboratorio</Text>
              <LeftArrow />
            </>
          )}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 5 || stoneComputerOccuped === 5 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 5 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 5 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 6 || stoneComputerOccuped === 6 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 6 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 6 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <SpiderIcon />
          )}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 7 || stoneComputerOccuped === 7 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 7 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 7 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 8 || stoneComputerOccuped === 8 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 8 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 8 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 9 || stoneComputerOccuped === 9 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 9 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 9 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 10 || stoneComputerOccuped === 10 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 10 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 10 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 11 || stoneComputerOccuped === 11 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 11 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 11 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 12 || stoneComputerOccuped === 12 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 12 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 12 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <>
              <Text style={styles.stoneText}>Salón</Text>
              <RightArrow />
            </>
          )}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 13 || stoneComputerOccuped === 13 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 13 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 13 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 14 || stoneComputerOccuped === 14 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 14 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 14 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 15 || stoneComputerOccuped === 15 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 15 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 15 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 16 || stoneComputerOccuped === 16 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 16 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 16 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 17 || stoneComputerOccuped === 17 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 17 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 17 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 18 || stoneComputerOccuped === 18 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 18 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 18 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 19 || stoneComputerOccuped === 19 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 19 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 19 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 20 || stoneComputerOccuped === 20 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 20 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 20 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 21 || stoneComputerOccuped === 21 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 21 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 21 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <>
              <Text style={styles.stoneText}>Biblioteca</Text>
              <LeftArrow />
            </>
          )}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 22 || stoneComputerOccuped === 22 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 22 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 22 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 23 || stoneComputerOccuped === 23 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 23 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 23 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 24 || stoneComputerOccuped === 24 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 24 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 24 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 25 || stoneComputerOccuped === 25 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 25 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 25 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 26 || stoneComputerOccuped === 26 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 26 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 26 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <SpiderIcon />
          )}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 27 || stoneComputerOccuped === 27 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 27 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 27 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <>
              <Text style={styles.stoneText}>Alcoba</Text>
              <RightArrow />
            </>
          )}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 28 || stoneComputerOccuped === 28 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 28 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 28 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : null}
        </>
      ),
    },
    {
      content: (
        <>
          {stoneOccuped === 29 || stoneComputerOccuped === 29 ? (
            <View style={styles.playersContainer}>
              {/* Jugador */}
              {stoneOccuped === 29 && (
                <Image
                  style={styles.playerContainer}
                  source={playerImage}
                  resizeMode="cover"
                />
              )}

              {/* Computadora */}
              {stoneComputerOccuped === 29 && isVisible && computerImage && (
                <Image
                  style={[styles.computerContainer, { marginLeft: leftDisplacement }]}
                  source={computerImage}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <>
              <ForwardArrow size={24} />
              <Text style={styles.stoneText}>Planta baja</Text>
            </>
          )}
        </>
      ),
    },
  ];
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

  useEffect(() => {
    const init = async () => {
      try {
        const turnValue = await getTurn();
        if (!turnValue) return;

        setTurn(turnValue);

        // Cargar datos del jugador y computadora en paralelo
        const [playerValue, computerValue] = await Promise.all([
          getPlayerData(),
          getComputerData(),
        ]);

        // === Jugador ===
        if (playerValue?.position !== undefined) {
          setPlayerData(playerValue);
          setPosition(playerValue.position);
          setStoneOccuped(playerValue.position);
          scrollToPlayerPosition(playerValue.position);
        }
        // === Computadora ===
        let computerIndex = null;
        console.log("computerValue en FirstFloor useEffect:", computerValue);
        if (computerValue) {
          setComputerData(computerValue);  
          if (computerValue.floor === 'firstFloor') {
            computerIndex = computerValue.position;
            setIsVisible(true);
            setStoneComputerOccuped(computerIndex);
            setComputerPosition(computerIndex);
            scrollToComputerPosition(computerIndex);
          }
        }
        if (!diceValue) return;
        console.log("turnValue:", turnValue);
        if (turnValue === 'player' && playerValue?.position !== undefined) {
          updateBorderColors(playerValue.position, diceValue);
          setInstructionsText("Selecciona una casilla amarilla para moverte");
          fetchPosition();
        } else if (turnValue === 'computer' && computerIndex !== null) {
          setTimeout(() => computerMovement(computerValue), 800);
          setInstructionsText(`${computerValue.name} está moviendo...`);
        }
        playRainSound();
        fetchPlayer(playerValue)
      } catch (error) {
        console.error("Error en init FirstFloor:", error);
      }
    };

    init();
  }, [diceValue]); // ← Solo se ejecuta cuando llega el dado
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
 /*useEffect(() => { //para desplazar la ficha de la computadora si coincide con la del jugador... No funciona pero queda bien
  if (
    stoneOccuped != null &&
    stoneComputerOccuped != null &&
    stoneOccuped === stoneComputerOccuped
  ) {
    setLeftDisplacement(-23); // ← Desplaza computadora a la izquierda
  } else {
    setLeftDisplacement(0);   // ← Vuelve a posición normal
  }
}, [stoneOccuped, stoneComputerOccuped]);*/
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
        setPosition(playerIndex);
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
  /*const fetchComputerPosition = async () => {
    try {
      const storedValue = await getComputerData();
      if (storedValue !== null) {
        const computerIndex = Number(storedValue.position);
        setTimeout(() => {
          scrollToComputerPosition(computerIndex);
        }, 500);
        //setPosition(computerIndex);
        setComputerPosition(computerIndex);
        setStoneComputerOccuped(computerIndex);
        if (
          (computerIndex <= 4 && computerIndex + Number(diceValue) > 4) ||
          (computerIndex >= 4 && computerIndex - Number(diceValue) < 4)
        ) {
          setRoom1Color("yellow");
          setDisabledRoom1(false);
        } else {
          setRoom1Color(null);
          setDisabledRoom1(true);
        }
        if (
          (computerIndex <= 21 && computerIndex + Number(diceValue) > 21) ||
          (computerIndex >= 21 && computerIndex - Number(diceValue) < 21)
        ) {
          setRoom2Color("yellow");
          setDisabledRoom2(false);
        } else {
          setRoom2Color(null);
          setDisabledRoom2(true);
        }
        if (
          (computerIndex <= 12 && computerIndex + Number(diceValue) > 12) ||
          (computerIndex >= 12 && computerIndex - Number(diceValue) < 12)
        ) {
          setRoom3Color("yellow");
          setDisabledRoom3(false);
        } else {
          setRoom3Color(null);
          setDisabledRoom3(true);
        }
        if (
          (computerIndex <= 27 && computerIndex + Number(diceValue) > 27) ||
          (computerIndex >= 27 && computerIndex - Number(diceValue) < 27)
        ) {
          setRoom4Color("yellow");
          setDisabledRoom4(false);
        } else {
          setRoom4Color(null);
          setDisabledRoom4(true);
        }
      }
    } catch (error) {
      console.error("Error fetching computer position:", error);
    }
  };*/
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
  const storePlayerPosition = async (position) => {
    try {
      await AsyncStorage.setItem("position", position);
    } catch (e) {
      console.log("error saving position");
    }
  };
  const storeTurn = async (item) => {
    try {
      await AsyncStorage.setItem("turn", item);
    } catch (e) {
      console.log("error saving turn");
    }
  };
  const editPositionPlayer = async (index) => {
    if (!playerData) return;
    const updatedPlayerData = { ...playerData, position: index };
    await AsyncStorage.setItem("playerData", JSON.stringify(updatedPlayerData));
    setPlayerData(updatedPlayerData);
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
  const storeComputerPosition = async (position) => {
    //se guardan las cartas de la computadora
    try {
      const storedData = await AsyncStorage.getItem("computerData");
      const currentData = storedData ? JSON.parse(storedData) : null;
      if (!currentData) return;

      const updatedComputer = { ...currentData, position: position };
      await AsyncStorage.setItem(
        "computerData",
        JSON.stringify(updatedComputer)
      );
      setComputerData(updatedComputer);
    } catch (e) {
      console.log("❌ Error updating data:", e);
    }
  };
  const computerMovement = (data) => {
    console.log("Iniciando movimiento de computadora con data:", data);    
    const currentPos = Number(data.position);
    const dice = Number(diceValue);
    const forward = currentPos + dice;
    const backward = currentPos - dice;

    let targetIndex = currentPos; // por defecto no se mueve

    console.log("Computadora en:", currentPos, "Dado:", dice);

    // === LÓGICA POR HABITACIÓN ===r
    if (
      data.roomToGo === "Laboratorio" &&
      currentPos <= 4 &&
      forward > 4
    ) {
      setTimeout(() => roomClicked("Laboratorio"), 1500);
      return;
    }
    if (data.roomToGo === "Salón" && currentPos <= 12 && forward > 12) {
      setTimeout(() => roomClicked("Salón"), 1500);
      return;
    }
    if (
      data.roomToGo === "Biblioteca" &&
      currentPos <= 21 &&
      forward > 21
    ) {
      setTimeout(() => roomClicked("Biblioteca"), 1500);
      return;
    }
    if (
      data.roomToGo === "Alcoba" &&
      currentPos <= 27 &&
      forward > 27
    ) {
      setTimeout(() => roomClicked("Alcoba"), 1500);
      return;
    }

    // === MOVIMIENTO NORMAL ===
    if (forward < 30) {
      targetIndex = forward;
    } else if (backward > 0) {
      targetIndex = backward;
    }

    // === EJECUTAR MOVIMIENTO ===
    stoneClickedByComputer(targetIndex);

    setTimeout(() => {
      scrollToComputerPosition(targetIndex);
    }, 600);

    setInstructionsText("Te toca tirar el dado!");
  };
  const stoneClickedByComputer = (index) => {
    console.log("Computadora se mueve a:", index);
    setStoneComputerOccuped(index);
    if (index === 6 || index === 26) {
      setTimeout(() => playJump(), 100);
    } else {
      playFootSteps();
    }
    storeComputerPosition(index);
    setActivateLoop(true);
    setDisabledSquare(true);
    setDisabledDice(false); // Enable dice for player
    // Teletransporte araña
    if (index === 6) {
      setTimeout(() => {
        setStoneComputerOccuped(26);
        storeComputerPosition(26);
        scrollToComputerPosition(26);
      }, 1200);
    }
    if (index === 26) {
      setTimeout(() => {
        setStoneComputerOccuped(6);
        storeComputerPosition(6);
        scrollToComputerPosition(6);
      }, 1200);
    }

    // Salir del tablero
    if (index === 0 || index === 29) {
    //setear cambio de planta y roomToGo en computerData...
    }
    storeTurn("player");
  };
  const stoneClicked = (index) => {
    storeTurn("computer");
    setStoneOccuped(index);
    if (index === 6 || index === 26) {
      setTimeout(() => {
        playJump();
      }, 100);
    } else {
      playFootSteps();
    }
    setInstructionsText("Turno para otro investigador");
    setPosition(index);
    storePlayerPosition(index.toString()); //hay que cambiarlo por editar el objeto playerData

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
      storePlayerPosition("26");
      setPosition(26); //hay que cambiarlo por editar el objeto playerData
      setStoneOccuped(26);
    }
    if (index === 26) {
      storePlayerPosition("6"); //hay que cambiarlo por editar el objeto playerData
      setPosition(6);
      setStoneOccuped(6);
    }
    setTimeout(() => {
      toComputerDiceRoll();
    }, 1000);
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
                onPress={() => roomClicked("Salón")}
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
