import { FirstFloor } from '../components/FirstFloor'; 
import { useLocalSearchParams } from "expo-router";
import { Ground } from '../components/Ground';


export default function Board(){
    const { diceValue = "0" } = useLocalSearchParams(); // Valor por defecto  
    const { board } = useLocalSearchParams(); // Valor por defecto  
    console.log('board en board', board)
    if (board === 'firstFloor'){
        return(
            <FirstFloor diceValue={diceValue} />
        )
    }else if (board === 'ground'){
        return(
            <Ground diceValue={diceValue} />
        )
    }
}