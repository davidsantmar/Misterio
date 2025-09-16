import { FirstFloorAdvance } from "../components/FirstFloorAdvance";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function FirstFloor(){
const { diceValue = "0" } = useLocalSearchParams(); // Valor por defecto  
    return(
       <View style={styles.container}>
        <FirstFloorAdvance diceValue={diceValue} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: '100%',
      width: '100%'
    }
})