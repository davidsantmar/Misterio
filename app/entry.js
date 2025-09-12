import { View, Text, Pressable, ImageBackground, StyleSheet } from 'react-native';

export default function Entry() {
    return (
        <ImageBackground source={require ('../assets/entrance.png')} 
          resizeMode="cover" 
          style={styles.container}>
          <View style={styles.instructions}>
              <Text style={styles.button_text}>Por dónde quieres empezar?</Text>
          </View>
          <View style={styles.buttons_container}>
            <Pressable style={styles.first_floor_container} >
              <Text style={styles.button_text}>Primer piso</Text>
            </Pressable>
            <Pressable style={styles.ground_container} >
              <Text style={styles.button_text}>Planta baja</Text>
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
    
  },
  buttons_container: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: 140,
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
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25
  }
})