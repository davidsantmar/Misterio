import { useLocalSearchParams } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

// Mapa de recursos estáticos con require
const gifMap = {
  Laboratorio: require("../assets/gifs/Laboratorio.gif"),
  // Agrega más salas según sea necesario, ej: Sala2: require("../assets/gifs/Sala2.gif")
};

const imageMap = {
  Laboratorio: require("../assets/images/Laboratorio.png"),
  // Agrega más salas según sea necesario, ej: Sala2: require("../assets/images/Sala2.png")
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
    <ImageBackground
      style={styles.container}
      source={gifSource}
      resizeMode="cover"
    >
        <View style={styles.instructions}>
            <Text style={styles.text}>Quién ha muerto aquí?</Text>
        </View>
        <View style={styles.instructions}>
            <Text style={styles.text}>Quién ha sido el asesino?</Text>
        </View>

    </ImageBackground>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
  instructions: {
    justifyContent: 'center',
    marginTop: 80,
    width: '90%',
    backgroundColor: 'lightblue',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25
  }
})