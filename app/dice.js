import { DiceRoll } from "../components/DiceRoll";
import { View } from "react-native";

export default function Dice() {
  return (
    <View style={{ flex: 1 }}>
      <DiceRoll />
    </View>
  );
}