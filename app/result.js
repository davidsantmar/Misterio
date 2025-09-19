import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import { ForwardArrow, BackArrow } from "../components/Icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Result() {
    const router = useRouter();
    const { diceValue = "0" } = useLocalSearchParams();
    const [lab, setLab] = useState(4);
    const [lounge, setLounge] = useState(10);
    const [library, setLibrary] = useState(18);
    const [bedroom, setBedroom] = useState(28);
    const [groundNorth, setGroundNorth] = useState(34);
    const [groundSouth, setGroundSouth] = useState(0);
    const [loaded, error] = useFonts({
        'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'),
    });
    const [playerPosition, setPlayerPosition] = useState(0);
    const [labColor, setLabColor] = useState('black');
    const [loungeColor, setLoungeColor] = useState('black');
    const [libraryColor, setLibraryColor] = useState('black');
    const [bedroomColor, setBedroomColor] = useState('black');
    const [groundNorthColor, setGroundNorthColor] = useState('black');
    const [groundSouthColor, setGroundSouthColor] = useState('black');

    if (!loaded && !error) return <View><Text>Cargando...</Text></View>;
    if (error) console.error('Error cargando fuente:', error);

    const getPlayerPosition = async () => {
        try {
            const value = await AsyncStorage.getItem('position');
            return value;
        } catch (e) {
            console.log('error reading data');
            return null;
        }
    };

    const storePlayerPosition = async (position) => {
        try {
            await AsyncStorage.setItem('position', position);
        } catch (e) {
            console.log('error saving data');
        }
    };

    const showPossibilities = () => {
        if (lab - playerPosition <= 0){
              router.push({
                pathname: "/placeDoor",
                params: { placeName: 'Laboratorio'}
             //setLabColor('red');
            })
        }
        if (lounge - playerPosition <= 0){ 
            router.push({
                pathname: "/placeDoor",
                params: { placeName: 'Salón'}
            //setLoungeColor('red');
            })
        }
        if (library - playerPosition <= 0){ 
            router.push({
                pathname: "/placeDoor",
                params: { placeName: 'Biblioteca'}
            })
            //setLibraryColor('red');
        }
        if (bedroom - playerPosition <= 0){ 
            router.push({
                pathname: "/placeDoor",
                params: { placeName: 'Alcoba'}
            })
            //setBedroomColor('red');
        }
        if (groundNorth - playerPosition <= 0){ 
            router.push({
                pathname: "/placeDoor",
                params: { placeName: 'Biblioteca'}
            })
            //setGroundNorthColor('red');
        }
    };

    const diceRoll = () => {
        router.push("/dice");
    };

    useEffect(() => {
    const initializePosition = async () => {
        try {
            const newPosition = isNaN(Number(diceValue)) ? 0 : Number(diceValue); // Valida diceValue
            const oldStoredValue = await getPlayerPosition();
            const oldPosition = Number(oldStoredValue) || 0; // Maneja null/no numérico
            const sum = oldPosition + newPosition; // Suma numérica
            await storePlayerPosition(sum.toString()); // Guarda como string
            const currentStoredValue = await getPlayerPosition();
            const positionNum = Number(currentStoredValue) || 0; // Convierte a número
            console.log('Stored value:', currentStoredValue, 'Parsed position:', positionNum, 'Type:', typeof positionNum);
            setPlayerPosition(positionNum);
        } catch (e) {
            console.log('Error en inicialización:', e);
            setPlayerPosition(0); // Valor por defecto en error
        }
    };
    initializePosition();
}, [diceValue]);

    useEffect(() => {
        showPossibilities();
    }, [playerPosition]);

    const distance = (target) => target - playerPosition;
    const backwardDistance = (target) => playerPosition - target;

    return (
        <ImageBackground style={styles.container} source={require('../assets/images/result.png')}>
           
            <Pressable style={styles.forwardContainer} onPress={diceRoll}>
                <View style={styles.infoContainer}>
                    {distance(lab) >= 0 && <Text style={[styles.info, { color: labColor }]}>Al laboratorio: {distance(lab)}</Text>}
                    {distance(lounge) >= 0 && <Text style={[styles.info, { color: loungeColor }]}>Al salón: {distance(lounge)}</Text>}
                    {distance(library) >= 0 && <Text style={[styles.info, { color: libraryColor }]}>A la biblioteca: {distance(library)}</Text>}
                    {distance(bedroom) >= 0 && <Text style={[styles.info, { color: bedroomColor }]}>A la alcoba: {distance(bedroom)}</Text>}
                    {distance(groundNorth) >= 0 && <Text style={[styles.info, { color: groundNorthColor }]}>A la planta baja: {distance(groundNorth)}</Text>}
                </View>
                <ForwardArrow />
            </Pressable>
            <Pressable style={styles.backContainer}>
                <View style={styles.infoContainer}>
                    {playerPosition >= lab && <Text style={[styles.info, { color: labColor }]}>Al laboratorio: {backwardDistance(lab)}</Text>}
                    {playerPosition >= lounge && <Text style={[styles.info, { color: loungeColor }]}>Al salón: {backwardDistance(lounge)}</Text>}
                    {playerPosition >= library && <Text style={[styles.info, { color: libraryColor }]}>A la biblioteca: {backwardDistance(library)}</Text>}
                    {playerPosition >= bedroom && <Text style={[styles.info, { color: bedroomColor }]}>A la alcoba: {backwardDistance(bedroom)}</Text>}
                    {playerPosition >= groundSouth && <Text style={[styles.info, { color: groundSouthColor }]}>A la planta baja: {backwardDistance(groundSouth)}</Text>}
                </View>
                <BackArrow />
            </Pressable>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: '100%',
      width: '100%'
    },
    forwardContainer: {
        backgroundColor: 'lightblue',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        marginTop: 120,
        marginLeft: 40,
        flexDirection: 'row'
    },
    backContainer : {
        backgroundColor: 'lightblue',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        marginTop: 300,
        marginLeft: 40,
        flexDirection: 'row'
    },
    info: {
        fontFamily: 'Creepster-Regular',
        fontSize: 20,
        marginBottom: 10
    },
   infoContainer: {
        flexDirection: 'column',
        marginRight: 20
   }
})