import { DiceRoll } from "../components/DiceRoll";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dice() {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  useEffect(() => {
    const init = async () => {
      const turn = await getTurn();
      if (turn) {
        fetchPlayerAndSetTurn(turn);
      }
    };

    init();
  }, []);


  const getTurn = async () => {
    try {
      const turn = await AsyncStorage.getItem('turn');
      if (turn === null) {
        console.log('No turn found in AsyncStorage');
        return null; // O un valor predeterminado, como 'player'
      }
      setCurrentTurn(turn);
      return turn;
    } catch (e) {
      console.log('❌ Error reading turn:', e);
      return null; // O manejar el error de otra manera
    }
  };
  
  const fetchPlayerAndSetTurn = async (turn) => {
    try {
      if (turn === 'playerData') {
        const value = await AsyncStorage.getItem("playerData");
        const playerData = value ? JSON.parse(value) : null;
        setCurrentPlayer(playerData);
      } 
      else if (turn === 'computerData') {
        const value = await AsyncStorage.getItem("computerData");
        const computerData = value ? JSON.parse(value) : null;
        setCurrentPlayer(computerData);
      }
    } catch (e) {
      console.log("❌ Error in fetchPlayerAndSetTurn:", e);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <DiceRoll />
    </View>
  );
}
