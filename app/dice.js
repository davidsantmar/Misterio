import { DiceRoll } from "../components/DiceRoll";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Dice() {
  //const { board } = useLocalSearchParams();
  const { floor } = useLocalSearchParams()
  
  console.log('floor en Dice', floor)
  return (
    <View style={{ flex: 1 }}>
      <DiceRoll floor={floor} />
    </View>
  );
}