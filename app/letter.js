import { ImageBackground, Text, StyleSheet, Pressable, View } from "react-native";
import { useFonts } from 'expo-font';
import { useRouter } from "expo-router";

export default function Letter(){
    const [loaded, error] = useFonts({  //to load and use font
        'ShadowsIntoLightTwo': require('../assets/fonts/ShadowsIntoLightTwo.ttf'), 
    });
    const router = useRouter();

    const toSelectPlayer = () => {
        //playOpenDoor();
        router.push({
            pathname: '/womanPlayer',
        });
    }
    return(
       <ImageBackground style={styles.container}  source={require ('../assets/images/letter-back.png')}>
            <View style={styles.textContainer}>
                <Text style={styles.letterText}>
                    Le contactamos para encargarle la investigación del misterio del castillo de Transilvania.
                    Un excéntrico aristócrata y la servidumbre que allí vivía han desaparecido en extrañas circunstancias. 
                    Los únicos datos que se tienen están basados en leyendas y supersticiones de las gentes del lugar, 
                    sobre los monstruos que habitan en el castillo y que en las noches de luna llena regresan, y atacan a todo aquel que ose vivir o pasar por allí.
                </Text>
                <View style={styles.signatureContainer}>
                    <Text style={styles.signatureTitle}>
                        La Talamasca
                    </Text>
                    <Text style={styles.signatureText}>
                        Vigilamos
                    </Text>
                    <Text style={styles.signatureText}>
                        y siempre estamos aquí
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
        marginTop: 200,
        padding: 30
    },
    letterText: {
        fontFamily: 'ShadowsIntoLightTwo',
        fontSize: 20,
        transform: [{ rotate: '2deg' }] 
    },
    signatureContainer: {
        marginTop: 100,
        marginLeft: 200,
        transform: [{ rotate: '2deg' }] 
    },
    signatureTitle: {
        fontFamily: 'ShadowsIntoLightTwo',
        fontSize: 24,
        transform: [{ rotate: '2deg' }] 
    },
    signatureText: {
        fontFamily: 'ShadowsIntoLightTwo',
        fontSize: 18,
        transform: [{ rotate: '2deg' }] 
    },
  button: {
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 100,
    padding: 10
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25
  }
})