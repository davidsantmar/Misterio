import { ImageBackground, StyleSheet, Text, View, Pressable } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
const killers = {
      MrHyde: require('../assets/images/mis/MrHyde.png'),
      Dracula: require('../assets/images/mis/Dracula.png'),
      Frankenstein: require('../assets/images/mis/Frankenstein.png'),
      Hombrelobo : require('../assets/images/mis/Werewolf.png'),
      Fantasma: require('../assets/images/mis/Ghost.png'),
      Momia: require('../assets/images/mis/Mummy.png'),
    };
    const victims = {
      Conde: require('../assets/images/te/Count.png'),
      Condesa: require('../assets/images/te/Countess.png'),
      Jardinero: require('../assets/images/te/Gardener.png'),
      Amadellaves: require('../assets/images/te/Housekeeper.png'),
      Mayordomo: require('../assets/images/te/Butler.png'),
      Doncella: require('../assets/images/te/Maid.png'),
    };
    const rooms = {
      Laboratorio: require('../assets/images/boardImages/Labo.png'),
      Salon: require('../assets/images/boardImages/Lounge.png'),
      Biblioteca: require('../assets/images/boardImages/Library.png'),
      Alcoba: require('../assets/images/boardImages/Bedroom.png'),
      /*Cocheras: require('../assets/images/boardImages/Garage.png'),
      Vestibulo: require('../assets/images/boardImages/Lobby.png'),
      Panteon: require('../assets/images/boardImages/Pantheon.png'),
      Bodega: require('../assets/images/boardImages/Store.png'),*/
    };
const getData = async (data) => {
  try {
    const stringArray = await AsyncStorage.getItem(data); // Obtener la cadena
    if (stringArray !== null) {
      const array = JSON.parse(stringArray); // Convertir la cadena a array
      console.log('Array recuperado:', array);
      return array;
    } else {
      console.log('No se encontró el array');
      return null;
    }
  } catch (error) {
    console.error('Error al recuperar el array:', error);
    return null;
  }
};
export function ShowCardsButton({ onPress }){
      const [loaded, error] = useFonts({
        'Creepster-Regular': require('../assets/fonts/Creepster-Regular.ttf'),
      });
      const [position, setPosition] = useState('absolute'); 
   const [rotation1, setRotation1] = useState('25deg');
  const [rotation2, setRotation2] = useState('45deg');
      
      const [cardBorderColor, setCardBorderColor] = useState('red');
      const [misText, setMisText] = useState('MIS');
      const [cardBorderWidth, setCardBorderWidth] = useState(2);
      const [cardMarginTop, setCardMarginTop] = useState(20);
      const [cardTextFontSize, setCardTextFontSize] = useState(15);
      const [card1, setCard1] = useState('');
      const [card2, setCard2] = useState('');
      const [card3, setCard3] = useState('');
      const [card4, setCard4] = useState('');
      const [card5, setCard5] = useState('');
      const [card6, setCard6] = useState('');
      const [card7, setCard7] = useState('');
      const [card8, setCard8] = useState('');
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);
      const [cardNames, setCardNames] = useState([]);
        const [playerCards, setPlayerCards] = useState([]);
 useEffect(() => {
    getData('playerCards').then((retrievedPlayerCards) => {
      const playerCardsWithoutSpaces = retrievedPlayerCards.map(string => string.replace(/\s/g, '')); //remove spaces in array elements
      const playerCardsWithSpaces = retrievedPlayerCards;
      setPlayerCards(playerCardsWithoutSpaces);
      setCardNames(playerCardsWithSpaces);
    });
    
  }, []);
const showCards = () => {
    onPress();
    setPosition(prevPosition => 
      prevPosition === 'relative' ? 'absolute' : 'relative'
    );
    setRotation1(prevRotation =>
      prevRotation === '0deg' ? '25deg' : '0deg'
    )
    setRotation2(prevRotation =>
      prevRotation === '0deg' ? '45deg' : '0deg'
    )
    setCardBorderColor(prevColor => 
      prevColor === 'red' ? '' : 'red'
    )
    setCardBorderWidth(prevBorder => 
      prevBorder === 2 ? 0 : 2
    )
    setMisText(prevText => 
      prevText === playerCards[7] ? 'MIS' : playerCards[7]
    )
    setCardMarginTop(prevTop => 
      prevTop === 10 ? 20 : 10
    )
    setCardTextFontSize(prevFontSize =>
      prevFontSize === 10 ? 15 : 10
    )
    setCard1(prevCard => prevCard === killers[playerCards[0]] ? '' : killers[playerCards[0]]);
    setCard2(prevCard => prevCard === killers[playerCards[1]] ? '' : killers[playerCards[1]]);
    setCard3(prevCard => prevCard === victims[playerCards[2]] ? '': victims[playerCards[2]]);
    setCard4(prevCard => prevCard === victims[playerCards[3]] ? '': victims[playerCards[3]]);
    setCard5(prevCard => prevCard === victims[playerCards[4]] ? '' : victims[playerCards[4]]);
    setCard6(prevCard => prevCard === rooms[playerCards[5]] ? '' : rooms[playerCards[5]]);
    setCard7(prevCard => prevCard === rooms[playerCards[6]] ? '' : rooms[playerCards[6]]);
    setBackgroundOpacity(prevOpacity => //como influir en board o en room?
      prevOpacity === 1 ? 0.5 : 1
    )
  }
  return (
      <>
      <View style={{
            position: 'absolute',
            bottom: 750,
            alignSelf: 'center',
            zIndex: 1,
            left: 335,
          }}>
            <Pressable 
              style={styles.yourCardsContainer}
              onPress={showCards}
            >
              <Text style={styles.yourCardsText}>Tus cartas</Text>
                <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, borderRadius: 8, marginTop: cardMarginTop }]} source={card1} resizeMode="cover">
                  <Text style={styles.cardName}>{cardNames[0]}</Text>
              </ImageBackground>
              
              <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card2} resizeMode="contain">
                  <Text style={styles.cardName}>{cardNames[1]}</Text>
              </ImageBackground>
              <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card3} resizeMode="contain">
                <Text style={styles.cardName}>{cardNames[2]}</Text>
              </ImageBackground>
              <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card4} resizeMode="contain">
                <Text style={styles.cardName}>{cardNames[3]}</Text>
              </ImageBackground>
              <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card5} resizeMode="contain">
                <Text style={styles.cardName}>{cardNames[4]}</Text>
              </ImageBackground>
              <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop }]} source={card6} resizeMode="contain">
                <Text style={styles.cardName}>{cardNames[5]}</Text>
              </ImageBackground>
              <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop, transform: [{rotate: (rotation1)}]} ]} source={card7} resizeMode="contain">
                <Text style={styles.cardName}>{cardNames[6]}</Text>
              </ImageBackground>
              <ImageBackground style={[styles.card, { borderWidth: cardBorderWidth, borderColor: cardBorderColor, position: position, marginTop: cardMarginTop, transform: [{rotate: (rotation2)}]} ]} source={card8} resizeMode="contain">
                  <Text style={[styles.cardText, { fontSize: cardTextFontSize  }]}>{misText}</Text>
              </ImageBackground>
            </Pressable>
          </View>
        </>
  )
}

const styles = StyleSheet.create({

  yourCardsContainer: {
    backgroundColor: '#6200ee',
    borderRadius: 5,
    width: 70,
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 5
  },
  yourCardsText: {
    color: 'white',
    padding: 2,
    fontSize: 10
  },
  card: {
    width: 60,
    height: 90,
    backgroundColor: 'black',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    color: 'white',
    backgroundColor: 'black',
    fontFamily: 'Creepster-Regular',
    fontSize: 10,
    padding: 2
  },
  cardText: {
    color: 'white',
    fontFamily: 'Creepster-Regular',
    fontSize: 15,
  }
});