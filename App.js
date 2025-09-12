import { StyleSheet, View } from 'react-native';
import { Intro } from './components/Intro';

export default function App() {
  return (
    <View style={styles.container}>
      <Intro />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

