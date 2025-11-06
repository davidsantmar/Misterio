import { FirstFloor } from '../components/FirstFloor'; 
import { useLocalSearchParams } from "expo-router";
import { Ground } from '../components/Ground';


export default function Board(){
    const { diceValue = "0" } = useLocalSearchParams(); // Valor por defecto  
    const { floor } = useLocalSearchParams(); // Valor por defecto      
    if (floor === 'firstFloor'){
        return(
            <FirstFloor diceValue={diceValue}  />
        )
    }else if (floor === 'ground'){
        return(
            <Ground diceValue={diceValue} />
        )
    }
}