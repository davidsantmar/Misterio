import { View, Text, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { useRouter, usePathname, Link} from "expo-router";

export default function Entry() {
  const router = useRouter();
   const toDice = () => {
        //playOpenDoor();
        router.push({
            pathname: '/dice',
        });
    }
    return (
        <ImageBackground source={require ('../assets/images/entrance.png')} 
          resizeMode="cover" 
          style={styles.container}>
          <View style={styles.instructions}>
              <Text style={styles.button_text}>A dónde te diriges?</Text>
          </View>
          <View style={styles.buttons_container}>
            <Pressable style={styles.first_floor_container} onPress={toDice}>
              <Text style={styles.button_text_title}>Primer piso</Text>
              <Text style={styles.button_text}>Laboratorio</Text>
              <Text style={styles.button_text}>Salón</Text>
              <Text style={styles.button_text}>Biblioteca</Text>
              <Text style={styles.button_text}>Alcoba</Text>
            </Pressable>
            <Pressable style={styles.ground_container} onPress={toDice}>
              <Text style={styles.button_text_title}>Planta baja</Text>
              <Text style={styles.button_text}>Cocheras</Text>
              <Text style={styles.button_text}>Vestíbulo</Text>
              <Text style={styles.button_text}>Panteón</Text>
              <Text style={styles.button_text}>Bodega</Text>
            </Pressable>
          </View> 
        </ImageBackground>
    );
};

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
  buttons_container: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: 80,
    width: '90%'
  },
  first_floor_container: {
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },
  ground_container: {
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  },
  button_text_title: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25,
    marginBottom: 10
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25
  }
})