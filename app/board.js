import { BoardFloor } from '../components/BoardFloor'; 
import { useLocalSearchParams, useRouter } from "expo-router";


export default function Board(){
    const { diceValue = "0" } = useLocalSearchParams(); // Valor por defecto  
    
    return(
        <BoardFloor diceValue={diceValue} />
    )
}