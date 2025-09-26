import { View, Text, Pressable, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { BackArrow, ForwardArrow, LeftArrow, RightArrow, SpiderIcon } from "./Icons";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function BoardFloor({ diceValue }) {
  const [loaded, error] = useFonts({
    'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'),
  });
  const [position, setPosition] = useState(0); 
 
  const [buttonColor, setButtonColor] = useState('lightblue');
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
  const [borderColors, setBorderColors] = useState(board.map(() => 'black')); // Color inicial para cada stone

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

      return newColors; // Devolver el nuevo arreglo para actualizar el estado
    });
  };
 
  const toDiceRoll = () => {
    router.push('/dice');
  
  };
  useEffect(() => { //la suma y guardado funciona bien
    const fetchPosition = async () => {
    const storedValue = await getPlayerPosition();
    console.log('Fetched stored value:', storedValue);
    //setPosition(storedValue !== null ? Number(storedValue) : 0);
    const newColors = [...colors];
    // aqui se encuentra el jugador
    newColors[storedValue] = newColors[storedValue] === '#FF6347' ? '#808080' : '#FF6347';
    
    updateBorderColors(storedValue, diceValue);
    
    setColors(newColors); // Actualizar el estado
    console.log('position:', storedValue)
    console.log('possibilityUp:', Number(storedValue) + (Number(diceValue)))
    console.log('possibilityDown:', Number(storedValue) - (Number(diceValue)))
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
    setButtonColor('lightgreen');
    //Tira dados a continuación
   
  }
  return (
    <ScrollView>
      
      <View style={styles.container}>
        <View style={styles.leftRoomsContainer}>
          <ImageBackground style={[styles.room1, { borderColor: room1Color}]} source={require('../assets/images/boardImages/Labo.png')} />
          <ImageBackground style={[styles.room2, { borderColor: room2Color}]} source={require('../assets/images/boardImages/Library.png')} />
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
          <Pressable style={[styles.buttonContainer, { backgroundColor: buttonColor }]} onPress={toDiceRoll}>
              <Text style={styles.buttonText}>Dados</Text>
            </Pressable>
          <ImageBackground style={[styles.room3, { borderColor: room3Color}]} source={require('../assets/images/boardImages/Lounge.png')} />
          <ImageBackground style={[styles.room4, { borderColor: room4Color}]} source={require('../assets/images/boardImages/Bedroom.png')} />
        </View>
      </View>
    </ScrollView>
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
  buttonContainer: {
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    fontFamily: 'Creepster-Regular',
    fontSize: 20
  }
});