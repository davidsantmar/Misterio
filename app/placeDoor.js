import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function placeDoor() {
    const { placeName } = useLocalSearchParams(); 
    const router = useRouter();
    const [room, setRoom] = useState(placeName);
    const toPlace = () => {
        router.push({
            pathname: "/room",
            params: { room: placeName}
        })
    }
    const diceRoll = () => {
        router.push("/dice");
    };
    return(
        <ImageBackground style={styles.container} source={require('../assets/images/door.png')}>
            <View style={styles.instructions}>
                <Text style={styles.button_text}>Quieres entrar?</Text>
            </View>
            <View style={styles.placePlate}>
                <Text style={styles.button_text}>{room}</Text>
            </View>
           <View style={styles.buttons_container}>
                <Pressable style={styles.button_container} onPress={toPlace}>
                    <Text style={styles.button_text}>Sí</Text>
                </Pressable>
                <Pressable style={styles.button_container} onPress={diceRoll}>
                    <Text style={styles.button_text}>No</Text>
                </Pressable>
            </View> 
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
    instructions: {
        justifyContent: 'center',
        marginTop: 80,
        width: '90%',
        backgroundColor: 'lightblue',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10
    },
    placePlate: {
        justifyContent: 'center',
        marginTop: 10,
        width: '90%',
        backgroundColor: '#FFD700',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10
    },
    button_text: {
        fontFamily: 'Creepster-Regular',
        fontSize: 25
    },
    buttons_container: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginTop: 140,
        width: '90%'
    },
    button_container: {
        backgroundColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 20
    }
})