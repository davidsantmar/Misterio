import { ImageBackground, StyleSheet } from 'react-native';
import { useEffect, useState } from "react";

export function FirstFloorAdvance ({ diceValue }){
    const [playerPosition, setPlayerPosition] = useState(0);
    const numericValue = parseInt(diceValue, 10) || 0; // Convierte a número, con 0 como valor por defecto

    const [gifSource, setGifSource] = useState(require('../assets/gifs/first-floor-advance.gif'));
  
    useEffect(() => {
        console.log(numericValue)
        setPlayerPosition(numericValue)
        // Cambia el GIF por una imagen estática después de X milisegundos (duración aproximada del GIF)
        const timer = setTimeout(() => {
          setGifSource(require('../assets/images/David.png')); // Imagen estática (resultado de la tirada)
        }, 5000); // Ajusta el tiempo según la duración del GIF
            return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }, []);
    return(
         <ImageBackground
            source={gifSource} 
            resizeMode="cover" 
            style={styles.container}
        >
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: '100%',
      width: '100%'
    },
    buttons_container: {
      justifyContent: 'space-around',
      flexDirection: 'row',
      marginTop: 140,
      width: '90%'
    },
    other_player_container: {
      backgroundColor: 'lightblue',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      padding: 10
    },
    button_container: {
      backgroundColor: 'lightblue',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      padding: 10
    },
    button_text: {
      fontFamily: 'Creepster-Regular',
      fontSize: 25
    }
  });