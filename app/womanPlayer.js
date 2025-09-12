import { StyleSheet, View, Text } from 'react-native';
import { NelyPlayer } from '../components/NelyPlayer'; // 👈 ajusté la ruta, porque si estás en app/selectPlayer.js debes subir un nivel

export default function WomanPlayer() {
  return (
    <View style={styles.container}>
      <NelyPlayer />
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
  }
});
