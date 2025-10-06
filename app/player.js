import { StyleSheet, View, Text } from 'react-native';
import { ChoosePlayer } from '../components/ChoosePlayer';

export default function Player() {
  return (
    <View style={styles.container}>
      <ChoosePlayer />
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
