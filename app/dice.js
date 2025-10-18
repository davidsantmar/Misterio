import { DiceRoll } from "../components/DiceRoll";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Dice() {
  const { board } = useLocalSearchParams();
  console.log('board en Dice', board)
  return (
    <View style={{ flex: 1 }}>
      <DiceRoll board={board} />
    </View>
  );
}