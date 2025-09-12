import { StyleSheet, View, Text } from 'react-native';
import { DavidPlayer } from '../components/DavidPlayer';

export default function ManPlayer() {
  return (
    <View style={styles.container}>
      <DavidPlayer />
      <View style={styles.button_container}>
        <Text style={styles.button_text}>Seleccionar</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1, // mejor usar flex:1 para que ocupe toda la pantalla
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_container: {
    backgroundColor: 'lightblue',
    height: 40,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 100,
    flex: 1
  },
  button_text: {
    fontFamily: 'Creepster-Regular',
    fontSize: 25
  }
});
