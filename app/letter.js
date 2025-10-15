import { ImageBackground, Text, StyleSheet, Pressable, View } from "react-native";
import { useFonts } from 'expo-font';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";

export default function Letter(){
    const [loaded, error] = useFonts({  //to load and use font
        'ShadowsIntoLightTwo': require('../assets/fonts/ShadowsIntoLightTwo.ttf'), 
    });
    const [letterSound, setLetterSound] = useState(null);
    const [buttonPress, setButtonPress] = useState(null);
    const router = useRouter();
    useEffect(() => {
        playLetterSound();
    }, [])
    useEffect(() => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
  
      // Liberación de sonidos al desmontar el componente
      return () => {
        if (letterSound) {
          console.log("Liberando letterSound");
          letterSound.unloadAsync();
        }
       if (buttonPress) {
          console.log("Liberando buttonPress");
          buttonPress.unloadAsync();
        }
      };
    }, [letterSound, buttonPress]);
    async function playLetterSound() {
        console.log("Cargando letterSound");
        try {
        if (letterSound) {
            // Si el sonido ya está cargado, reutilízalo
            console.log("Reproduciendo letterSound existente");
            await letterSound.replayAsync();
            return;
        }
    
        const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/letter.mp3")
        );
        setLetterSound(sound);
        console.log("Reproduciendo letterSound");
        await sound.playAsync();
        } catch (error) {
        console.error("Error al reproducir letterSound:", error);
        }
    }
    async function playButtonPress() {
        console.log("Cargando buttonPress");
        try {
        if (buttonPress) {
            // Si el sonido ya está cargado, reutilízalo
            console.log("Reproduciendo buttonPress existente");
            await buttonPress.replayAsync();
            return;
        }
    
        const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/button-press.mp3")
        );
        setButtonPress(sound);
        console.log("Reproduciendo buttonPress");
        await sound.playAsync();
        } catch (error) {
        console.error("Error al reproducir buttonPress:", error);
        }
    }
    const toSelectPlayer = () => {
        playButtonPress();
        router.push({
            pathname: '/player',
        });
    }
    return(
       <ImageBackground style={styles.container}  source={require ('../assets/images/letter-back.png')}>
            <View style={styles.textContainer}>
                <View style={{ transform: [{ rotate: '3deg' }] }}>
                    <Text style={styles.letterText}>
                    Le contactamos para encargarle la investigación del misterio del castillo de Transilvania.
                    Un excéntrico aristócrata y la servidumbre que allí vivía han desaparecido en extrañas circunstancias. 
                    Los únicos datos que se tienen están basados en leyendas y supersticiones de las gentes del lugar, 
                    sobre los monstruos que habitan en el castillo y que en las noches de luna llena regresan, y atacan a todo aquel que ose vivir o pasar por allí.
                    </Text>
                </View>
                <View style={styles.signatureContainer}>
                    <Text style={styles.signatureTitle}>
                        La Talamasca
                    </Text>
                    <Text style={styles.signatureText}>
                        Vigilamos y siempre estamos aquí
                    </Text>
                   
                </View>
            </View>
            <Pressable style={styles.button} onPress={toSelectPlayer}>
                <Text style={styles.button_text}>Continuar</Text>
            </Pressable>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: '100%',
      width: '100%'
    },
    textContainer: {
        marginTop: 160,
        padding: 10
    },
    letterText: {
        fontFamily: 'ShadowsIntoLightTwo',
        fontSize: 16,
        marginLeft: 20
    },
    signatureContainer: {
        marginLeft: 130,
        width: '90%',
        marginTop: 25,
        transform: [{ rotate: '3deg'}]
    },
    signatureTitle: {
        fontFamily: 'ShadowsIntoLightTwo',
        fontSize: 12,
    },
    signatureText: {
        fontFamily: 'ShadowsIntoLightTwo',
        fontSize: 12,
    },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 80,
    padding: 10
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25
  }
})