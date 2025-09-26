import { View, Text, Pressable, StyleSheet, ScrollView, ImageBackground, Image, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { BackArrow, ForwardArrow, LeftArrow, RightArrow, SpiderIcon } from "./Icons";
import { useState, useEffect, useRef, act } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function BoardFloor({ diceValue }) {
const bounceAnim = useRef(new Animated.Value(0)).current;
const [activateLoop, setActivateLoop] = useState(false); // Add this state
  const [loaded, error] = useFonts({
    'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'),
  });
  const [position, setPosition] = useState(0); 
  const [room1Color, setRoom1Color] = useState('white');
  const [room2Color, setRoom2Color] = useState('white');
  const [room3Color, setRoom3Color] = useState('white');
  const [room4Color, setRoom4Color] = useState('white');
  const router = useRouter();
  // Lista de casillas con sus contenidos para facilitar la gestión
  const board = [
    { content: <><ForwardArrow size={24} /><Text style={styles.stoneText}>Planta baja</Text></> },
    { content: null },
    { content: null },
    { content: null },
    { content: <><Text style={styles.stoneText}>Laboratorio</Text><LeftArrow /></> },
    { content: null },
    { content: <SpiderIcon /> },
    { content: null },
    { content: null },
    { content: null },
    { content: null },
    { content: null },
    { content: <><Text style={styles.stoneText}>Salón</Text><RightArrow /></> },
    { content: null },
    { content: null },
    { content: null },
    { content: null },
    { content: null },
    { content: null },
    { content: null },
    { content: null },
    { content: <><Text style={styles.stoneText}>Biblioteca</Text><LeftArrow /></> },
    { content: null },
    { content: null },
    { content: null },
    { content: null },
    { content: <SpiderIcon /> },
    { content: <><Text style={styles.stoneText}>Alcoba</Text><RightArrow /></> },
    { content: null },
    { content: <><Text style={styles.stoneText}>Planta baja</Text><BackArrow size={24} /></> },
  ];
  const [colors, setColors] = useState(board.map(() => '#808080')); // Color inicial para cada stone
  const [borderColors, setBorderColors] = useState(board.map(() => 'black')); 
  const updateBorderColors = (storedValue, diceValue) => {
    setBorderColors((prevColors) => {
      const newColors = [...prevColors]; // Crear una copia del arreglo
      const sumIndex = Number(storedValue) + Number(diceValue);
      const diffIndex = Number(storedValue) - Number(diceValue);
      // Validar que los índices sean válidos
      if (sumIndex >= 0 && sumIndex < newColors.length) {
        newColors[sumIndex] = newColors[sumIndex] === 'black' ? 'yellow' : 'black';
      }
      if (diffIndex >= 0 && diffIndex < newColors.length) {
        // Usar la misma condición que en sumIndex, si es intencional
        newColors[diffIndex] = newColors[diffIndex] === 'black' ? 'yellow' : 'black';
      }
      return newColors; 
    });
  };
  const toDiceRoll = () => {
    router.push('/dice');
  };
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
    const storedValue = await getPlayerPosition();
    console.log('Fetched stored value:', storedValue);
    const newColors = [...colors];
    // aqui se encuentra el jugador
    newColors[storedValue] = newColors[storedValue] === '#FF6347' ? '#808080' : '#FF6347';
    updateBorderColors(storedValue, diceValue);
    setColors(newColors); // Actualizar el estado
    // Resaltar habitaciones si el jugador puede entrar en ellas
    if ((storedValue <= 4 && Number(storedValue) + (Number(diceValue)) > 4) || (storedValue >= 4 && Number(storedValue) - (Number(diceValue)) < 4)){
      setRoom1Color('yellow');
    }
    if ((storedValue <= 12 && Number(storedValue) + (Number(diceValue)) > 12) || (storedValue >= 12 && Number(storedValue) - (Number(diceValue)) < 12)){
      setRoom3Color('yellow');
    }
    if ((storedValue <= 21 && Number(storedValue) + (Number(diceValue)) > 21) || (storedValue >= 21 && Number(storedValue) - (Number(diceValue)) < 21)){
      setRoom2Color('yellow');
    }
    if ((storedValue <= 27 && Number(storedValue) + (Number(diceValue)) > 27) || (storedValue >= 27 && Number(storedValue) - (Number(diceValue)) < 27)){
      setRoom4Color('yellow');
    }
  }
  fetchPosition();
  }, []);
  useEffect(() => {
    const newColors = [...colors];
    // aqui se encuentra el jugador
    newColors[position] = newColors[position] === '#FF6347' ? '#808080' : '#9cf1a7ff';
    setColors(newColors); // Actualizar el estado
  }, [position]);
  
  const getPlayerPosition = async () => {
    try {
        const value = await AsyncStorage.getItem('position');
        return value;
    } catch (e) {
        console.log('error reading data');
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
  const stoneClicked = (index) => { //se guarda la position al clickar
      setPosition(index)
      storePlayerPosition(index.toString());   
      setActivateLoop(true);  
      
  }
  return (
    <>
    <Animated.View style={{
      position: 'absolute',
      bottom: 600,
      alignSelf: 'center',
      transform: [{ translateY: bounceAnim }],
      zIndex: 1,
      left: 300
    }}>
      <Pressable 
        style={{
          backgroundColor: '#6200ee',
          padding: 16,
          borderRadius: 50,
          elevation: 5,
        }}
        onPress={toDiceRoll}
      >
        <Image 
          style={{ width: 50, height: 50, borderRadius: 50 }} 
          source={require('../assets/images/dice.png')} 
          resizeMode="cover"
        />
      </Pressable>
    </Animated.View>
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.leftRoomsContainer}>
          <Pressable>
            <ImageBackground style={[styles.room1, { borderColor: room1Color}]} source={require('../assets/images/boardImages/Labo.png')} />
          </Pressable>
          <Pressable>
            <ImageBackground style={[styles.room2, { borderColor: room2Color}]} source={require('../assets/images/boardImages/Library.png')} />
          </Pressable>
        </View>
        <View style={styles.stonesContainer}>
          {board.map((stone, index) => (
            <Pressable
              key={index}
              style={[styles.stone, {backgroundColor: colors[index], borderColor: borderColors[index]}]} 
              onPress={() => stoneClicked(index)}
            >
              {stone.content}
            </Pressable>
          ))}
        </View>
        <View style={styles.rightRoomsContainer}>
          <Pressable>
            <ImageBackground style={[styles.room3, { borderColor: room3Color}]} source={require('../assets/images/boardImages/Lounge.png')} />
          </Pressable>
          <Pressable>
            <ImageBackground style={[styles.room4, { borderColor: room4Color}]} source={require('../assets/images/boardImages/Bedroom.png')} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    padding: 15,
  },
  stonesContainer: {
    marginTop: 100,
    marginBottom: 100,
    padding: 10,
  },
  stone: {
    width: 80,
    height: 50,
    backgroundColor: 'grey',
    marginBottom: 1,
    borderRadius: 5,
    alignItems: 'center',
    padding: 1,
    justifyContent: 'center',
    borderWidth: 4,
  },
  stoneText: {
    fontFamily: 'Creepster-Regular',
  },
  leftRoomsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  room1: {
    height: 300,
    width: 150,
    marginBottom: 600,
    borderWidth: 4,
  },
  room2: {
    height: 300,
    width: 150,
    marginBottom: 150,
    borderWidth: 4,
  },
  rightRoomsContainer: {
    flexDirection: 'column',
    marginTop: 100,
  },
  room3: {
    height: 300,
    width: 150,
    marginTop: 300,
    borderWidth: 4,
  },
  room4: {
    height: 300,
    width: 150,
    marginTop: 400,
    borderWidth: 4,
  },
  diceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dice: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
});