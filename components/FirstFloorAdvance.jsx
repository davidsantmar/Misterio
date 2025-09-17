import { ImageBackground, StyleSheet } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';

export function FirstFloorAdvance ({ diceValue }){
    const router = useRouter();
    const numericValue = parseInt(diceValue, 10) || 0; // Convierte a número, con 0 como valor por defecto
    const [gifSource, setGifSource] = useState(require('../assets/gifs/first-floor-advance.gif'));
    useEffect(() => {
        const timer = setTimeout(() => {
          router.push({
            pathname: "/result",
            params: { diceValue: numericValue}, 
          });
        }, numericValue * 1000); // Ajusta el tiempo según el número que da el dado
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