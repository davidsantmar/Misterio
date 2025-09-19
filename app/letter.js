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
        transform: [{ rotate: '3deg' }],
        marginLeft: 20
    },
    signatureContainer: {
        marginLeft: 130,
        transform: [{ rotate: '3deg' }],
        width: '90%',
        marginTop: 25,
    },
    signatureTitle: {
        fontFamily: 'ShadowsIntoLightTwo',
        fontSize: 12,
        transform: [{ rotate: '1deg' }] 
    },
    signatureText: {
        fontFamily: 'ShadowsIntoLightTwo',
        fontSize: 12,
        transform: [{ rotate: '1deg' }] 
    },
  button: {
    backgroundColor: 'lightblue',
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