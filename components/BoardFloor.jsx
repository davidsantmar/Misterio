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
  const [possibility, setPossibility] = useState(0);
  //const [stored, setStored] = useState(0);
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
  const [colors, setColors] = useState(board.map(() => '#4682B4')); // Color inicial para cada stone
    const [borderColors, setBorderColors] = useState(board.map(() => 'black')); // Color inicial para cada stone

  // Mostrar posibilidades de movimiento
  const showPossibilities = (index) => {
    const newColors = [...colors];
    // Cambiar el color del stone clicado (por ejemplo, alternar entre dos colores)
    newColors[index] = newColors[index] === '#4682B4' ? '#FF6347' : '#4682B4';
    setColors(newColors); // Actualizar el estado
  }
 
  const toDiceRoll = () => {
    router.push('/dice');
    //setPosition(position + Number(diceValue));    
    //storePlayerPosition((position + Number(diceValue)).toString()); //posicion + dado
  };
  useEffect(() => { //la suma y guardado funciona bien
    const fetchPosition = async () => {
      const storedValue = await getPlayerPosition();
      console.log('Fetched stored value:', storedValue);
      setPosition(storedValue !== null ? Number(storedValue) : 0);
      const newColors = [...colors];
    // aqui se encuentra el jugador
    newColors[storedValue] = newColors[storedValue] === '#4682B4' ? '#FF6347' : '#4682B4';
    borderColors[Number(storedValue) + (Number(diceValue))] = borderColors[Number(storedValue) + (Number(diceValue))] === 'black' ? 'yellow' : 'black';

    setColors(newColors); // Actualizar el estado
    console.log(Number(storedValue) + (Number(diceValue)))
      //return storedValue;
    }
    fetchPosition();
    //position + dado debe iluminarse
    console.log('position + diceValue', position + Number(diceValue)) 
    //position vuelve a 0 tras pasar por dado :(
    

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
    //setPosition(index)
    console.log (index) //number

    storePlayerPosition(index.toString()); 
    //Tira dados a continuación
   
  }
  return (
    <ScrollView>
      
      <View style={styles.container}>
        <View style={styles.leftRoomsContainer}>
          <ImageBackground style={styles.room1} source={require('../assets/images/boardImages/Labo.png')} />
          <ImageBackground style={styles.room2} source={require('../assets/images/boardImages/Library.png')} />
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
          <Pressable style={styles.buttonContainer} onPress={toDiceRoll}>
              <Text style={styles.buttonText}>Dados</Text>
            </Pressable>
          <ImageBackground style={styles.room3} source={require('../assets/images/boardImages/Lounge.png')} />
          <ImageBackground style={styles.room4} source={require('../assets/images/boardImages/Bedroom.png')} />
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
  },
  room2: {
    height: 300,
    width: 150,
    marginBottom: 150,
  },
  rightRoomsContainer: {
    flexDirection: 'column',
    marginTop: 100,
  },
  room3: {
    height: 300,
    width: 150,
    marginTop: 300,
  },
  room4: {
    height: 300,
    width: 150,
    marginTop: 400,
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