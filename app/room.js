import { useLocalSearchParams } from "expo-router";
import { ImageBackground, StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";

// Mapa de recursos estáticos con require
const gifMap = {
  Laboratorio: require("../assets/gifs/Laboratorio.gif"),
 /* Salon: require("../assets/gifs/Salon.gif"),
  Biblioteca: require("../assets/gifs/Biblioteca.gif"),
  Alcoba: require("../assets/gifs/Alcoba.gif"),*/
};

const imageMap = {
  Laboratorio: require("../assets/images/Laboratorio.png"),
  /*Salon: require("../assets/images/Salon.png"),
  Biblioteca: require("../assets/images/Biblioteca.png"),
  Alcoba: require("../assets/images/Alcoba.png"),*/
};

export default function Room() {
  const { room } = useLocalSearchParams();
  const [gifSource, setGifSource] = useState(null);
  useEffect(() => {
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

  return (
    <ScrollView>
      <ImageBackground
        style={styles.container}
        source={gifSource}
        resizeMode="cover"
      >
        <View style={styles.firstTitle}>
            <Text style={styles.text}>Quién ha sido el asesino?</Text>
        </View>
        <View style={styles.charactersContainer}> 
          <View style={styles.characterContainer}>
            <Text style={styles.characterName}>Dr Jekyll/Mr Hyde</Text>
            <Image style={styles.character} source={require('../assets/images/mis/Dr_Jekyll.png')} />
          </View>
          <View style={styles.characterContainer}>
            <Text style={styles.characterName}>Drácula</Text>
          <Image style={styles.character} source={require('../assets/images/mis/Dracula.png')} />
          </View><View style={styles.characterContainer}>
            <Text style={styles.characterName}>Frankenstein</Text>
          <Image style={styles.character} source={require('../assets/images/mis/Frank.png')} />
          </View><View style={styles.characterContainer}>
            <Text style={styles.characterName}>Hombre lobo</Text>
          <Image style={styles.character} source={require('../assets/images/mis/Werewolf.png')} />
          </View><View style={styles.characterContainer}>
            <Text style={styles.characterName}>Fantasma</Text>
          <Image style={styles.character} source={require('../assets/images/mis/Ghost.png')} />
          </View><View style={styles.characterContainer}>
            <Text style={styles.characterName}>Momia</Text>
          <Image style={styles.character} source={require('../assets/images/mis/Mummy.png')} />
          </View>
        </View>
         <View style={styles.secondTitle}>
            <Text style={styles.text}>Quién ha muerto aquí?</Text>
        </View>

          <View style={styles.charactersContainer}> 
            <View style={styles.characterContainer}>
              <Text style={styles.characterName}>Conde</Text>
              <Image style={styles.character} source={require('../assets/images/te/Count.png')} />
            </View>
            <View style={styles.characterContainer}>
              <Text style={styles.characterName}>Condesa</Text>
            <Image style={styles.character} source={require('../assets/images/te/Countess.png')} />
            </View><View style={styles.characterContainer}>
              <Text style={styles.characterName}>Jardinero</Text>
            <Image style={styles.character} source={require('../assets/images/te/Gardener.png')} />
            </View><View style={styles.characterContainer}>
              <Text style={styles.characterName}>Ama de llaves</Text>
            <Image style={styles.character} source={require('../assets/images/te/Housekeeper.png')} />
            </View><View style={styles.characterContainer}>
              <Text style={styles.characterName}>Mayordomo</Text>
            <Image style={styles.character} source={require('../assets/images/te/Butler.png')} />
            </View><View style={styles.characterContainer}>
              <Text style={styles.characterName}>Doncella</Text>
            <Image style={styles.character} source={require('../assets/images/te/Maid.png')} />
            </View>
          </View>
      </ImageBackground>
    </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        marginBottom: 60
    },
  firstTitle: {
    justifyContent: 'center',
    marginTop:60,
    width: '90%',
    backgroundColor: 'lightblue',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  secondTitle: {
    justifyContent: 'center',
    width: '90%',
    backgroundColor: 'lightblue',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 20
  },
  charactersContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%',
    flexWrap: 'wrap'
  },
  characterContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterName: {
    fontFamily: 'Creepster-Regular',
       fontSize: 12,
  },
  character: {
    height: 175,
    width: 100,
  }
})