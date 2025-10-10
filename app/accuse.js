import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View, Image, Pressable, Animated } from "react-native";

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
  Laboratorio: require('../assets/images/boardImages/Labo.png'),
  Salon: require('../assets/images/boardImages/Lounge.png'),
  Biblioteca: require('../assets/images/boardImages/Library.png'),
  Alcoba: require('../assets/images/boardImages/Bedroom.png'),
  /*Cocheras: require('../assets/images/boardImages/Garage.png'),
  Vestibulo: require('../assets/images/boardImages/Lobby.png'),
  Panteon: require('../assets/images/boardImages/Pantheon.png'),
  Bodega: require('../assets/images/boardImages/Store.png'),*/
};
export default function Accuse(){
    const assumption = useLocalSearchParams(); 
    const [killerPrefix, setKillerPrefix] = useState(null);
    const [victimPrefix, setVictimPrefix] = useState(null);
    const [roomPrefix, setRoomPrefix] = useState(null);
    
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
   useEffect(() => {
    if (assumption[0] === 'Hombre lobo'){
      setKillerPrefix('El')
    }
    if (assumption[0] === 'Momia'){
      setKillerPrefix('La')
    }
    if (assumption[0] === 'Fantasma'){
      setKillerPrefix('El')
    }
    if (assumption[1] === 'Conde'){
      setVictimPrefix('al')
    }
    if (assumption[1] === 'Condesa'){
      setVictimPrefix('a la')
    }
    if (assumption[1] === 'Jardinero'){
      setVictimPrefix('al')
    }
    if (assumption[1] === 'Ama de llaves'){
      setVictimPrefix('al')
    }
    if (assumption[1] === 'Mayordomo'){
      setVictimPrefix('al')
    }
    if (assumption[1] === 'Doncella'){
      setVictimPrefix('a la')
    }
    if (assumption[2] === 'Laboratorio'){
      setRoomPrefix('el')
    }
    if (assumption[2] === 'Alcoba'){
      setRoomPrefix('la')
    }
    if (assumption[2] === 'Cocheras'){
      setRoomPrefix('las')
    }
    if (assumption[2] === 'Panteón'){
      setRoomPrefix('el')
    }
    if (assumption[2] === 'Bodega'){
      setRoomPrefix('la')
    }
    if (assumption[2] === 'Salón'){
      setRoomPrefix('el')
    }
    if (assumption[2] === 'Vestíbulo'){
      setRoomPrefix('el')
    }
    if (assumption[2] === 'Biblioteca'){
      setRoomPrefix('la')
    }
    //contenido de sobre para comparar al acusar definitivo
    const timer = setTimeout(() => {
      getData('envelope').then((retrievedEnvelope) => {
        console.log('Sobre guardado:', retrievedEnvelope);
        if (assumption[0] === retrievedEnvelope[0] && assumption[1] === retrievedEnvelope[1] && assumption[2] === retrievedEnvelope[2]) {
          console.log('victoria!') //desarrollar
        }else{
          console.log('derrota!')
        }
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  
    return(
        <ImageBackground
              style={styles.container}
              source={require("../assets/images/table-back.png")}
            >
            <Text style={styles.title}>Acusación</Text>
            <View style={styles.accuseCloudContainer}>
              <View style={styles.accuseCloud}>
                <Text style={styles.accuseSentence}>{killerPrefix} {assumption[0]} ha asesinado {victimPrefix} {assumption[1]} en {roomPrefix} {assumption[2]}</Text>

              </View>
            </View>
            <View style={styles.assumptionContainer}>
              <View style={styles.characterContainer}>
                <Text style={styles.characterName}>{assumption[0]}</Text>
                <Image style={styles.character} source={killersMap[assumption[0]]} />
              </View>
              <View style={styles.characterContainer}>
                <Text style={styles.characterName}>{assumption[1]}</Text>
                <Image style={styles.character} source={victimsMap[assumption[1]]} />
              </View>
              <View style={styles.characterContainer}>
                <Text style={styles.characterName}>{assumption[2]}</Text>
                <Image style={styles.character} source={roomsMap[assumption[2]]} />
              </View>
            </View>
            <ImageBackground style={styles.envelope} source={require("../assets/images/envelope.png")} resizeMode="cover">
              <Text style={styles.textEnvelope}>MISTERIO</Text>
            </ImageBackground>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: '100%'
    //opacity: 0.6
  },
  assumptionContainer: {
    marginTop: 10,
    flexDirection: 'row',
    marginLeft: 20

  },
  title:{
    fontFamily: 'Creepster-Regular',
    fontSize: 40,
    color: 'red',
    marginTop: 100
  },
  characterContainer: {
    padding: 5,
    alignItems: "center",
    backgroundColor: 'white',
    height: 190,
    width: 100,
    marginRight: 20
  },
  characterName: {
    fontFamily: "Creepster-Regular",
    fontSize: 15,
  },
  character: {
    height: 160,
    width: 80,
  },
  accuseCloudContainer: {
    padding: 20
  },
  accuseCloud: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
  },
  accuseSentence: {
    fontSize: 20,
    fontFamily: 'Creepster-Regular'
  },
  envelope: {
    position: 'absolute',
    bottom: 100,
    width: 250,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEnvelope: {
    fontSize: 35,
    fontFamily: 'Creepster-Regular',
    color: 'black',
    transform: [{ rotate: '-35deg' }],
  }
});