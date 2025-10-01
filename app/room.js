import { useLocalSearchParams } from "expo-router";
import { ImageBackground, StyleSheet, Text, View, Image, ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";

// Mapa de recursos estáticos con require
const gifMap = {
  Laboratorio: require("../assets/gifs/Laboratorio.gif"),
  /*Salon: require("../assets/gifs/Salon.gif"),
  Biblioteca: require("../assets/gifs/Biblioteca.gif"),
  Alcoba: require("../assets/gifs/Alcoba.gif"),*/
};

const imageMap = {
  Laboratorio: require("../assets/images/Laboratorio.png"),
  /*Salon: require("../assets/images/Salon.png"),
  Biblioteca: require("../assets/images/Biblioteca.png"),
  Alcoba: require("../assets/images/Alcoba.png"),*/
};

export default function Room() {
  const { room } = useLocalSearchParams();
  const [killersOpacity, setKillersOpacity] = useState(0);
  const [charactersOpacity, setCharactersOpacity] = useState(0);
  const [assumptionOpacity, setAssumptionOpacity] = useState(0);
  const [gifSource, setGifSource] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // New state to track selected section
  const [killer, setKiller] = useState(""); 
  const [victim, setVictim] = useState("");
  useEffect(() => {
    console.log("Room parameter:", room);
    if (gifMap[room] && imageMap[room]) {
      setGifSource(gifMap[room]); // Establecer el GIF inicialmente

      // Cambiar al PNG después de 5500ms
      const timer = setTimeout(() => {
        setGifSource(imageMap[room]);
      }, 5500);

      // Limpiar el temporizador al desmontar o cuando cambie `room`
      return () => clearTimeout(timer);
    } else {
      // Manejar caso de sala no encontrada
      setGifSource(null);
      console.warn(`No se encontraron recursos para la sala: ${room}`);
    }
  }, [room]);

  // Mostrar un componente de fallback si no hay recurso válido
  if (!gifSource) {
    return (
      <View style={styles.container}>
        <Text>Sala no encontrada: {room}</Text>
      </View>
    );
  }
  const showSection = (section) => {
    setSelectedSection(section); // Update the selected section
    if (section === "killers") {
      setKillersOpacity(1); // Show killers
      setCharactersOpacity(0); // Hide characters
    } else if (section === "characters") {
      setCharactersOpacity(1); // Show characters
      setKillersOpacity(0); // Hide killers
    }else if (section === "") {
      setCharactersOpacity(0); // Hide characters
      setKillersOpacity(0); // Hide killers
    }
  };
  const showKiller = (killer) => {    
    setAssumptionOpacity(1);
    setKiller(killer);
  }
  const showVictim = (victim) => {    
    setAssumptionOpacity(1);
    setVictim(victim);
  }

  const charactersSection = () => {
    if (selectedSection === "killers") {
      return (
        <View style={[styles.killersContainer, { opacity: killersOpacity }]}>
          <View style={styles.title}>
            <Text style={styles.text}>Elige un sospechoso</Text>
          </View>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Mr Hyde")}>
            <Text style={styles.characterName}>Dr Jekyll/Mr Hyde</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Dr_Jekyll.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Drácula")}>
            <Text style={styles.characterName}>Drácula</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Dracula.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("Frankenstein")}>
            <Text style={styles.characterName}>Frankenstein</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Frank.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("El hombre lobo")}>
            <Text style={styles.characterName}>Hombre lobo</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Werewolf.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("El fantasma")}>
            <Text style={styles.characterName}>Fantasma</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Ghost.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showKiller("La momia")}>
            <Text style={styles.characterName}>Momia</Text>
            <Image style={styles.character} source={require("../assets/images/mis/Mummy.png")} />
          </Pressable>
        </View>
      );
    } else if (selectedSection === "characters") {
      return (
        <View style={[styles.charactersContainer, { opacity: charactersOpacity }]}>
          <View style={styles.title}>
            <Text style={styles.text}>Elige una víctima</Text>
          </View>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("al Conde")}>
            <Text style={styles.characterName}>Conde</Text>
            <Image style={styles.character} source={require("../assets/images/te/Count.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("a la condesa")}>
            <Text style={styles.characterName}>Condesa</Text>
            <Image style={styles.character} source={require("../assets/images/te/Countess.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("al jardinero")}>
            <Text style={styles.characterName}>Jardinero</Text>
            <Image style={styles.character} source={require("../assets/images/te/Gardener.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("al ama de llaves")}>
            <Text style={styles.characterName}>Ama de llaves</Text>
            <Image style={styles.character} source={require("../assets/images/te/Housekeeper.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("al mayordomo")}>
            <Text style={styles.characterName}>Mayordomo</Text>
            <Image style={styles.character} source={require("../assets/images/te/Butler.png")} />
          </Pressable>
          <Pressable style={styles.characterContainer} onPress={() => showVictim("a la doncella")}>
            <Text style={styles.characterName}>Doncella</Text>
            <Image style={styles.character} source={require("../assets/images/te/Maid.png")} />
          </Pressable>
        </View>
      );
    }else if (selectedSection === "") {
      return (
        <View style={styles.roomTitleContainer}>
          <View style={styles.title}>
            <Text style={styles.text}>{room}</Text>
          </View>
        </View>
      )
    }
    return null; // Return nothing if no section is selected
  };
  const assumptionSection = () => {
    return(
      <View style={[styles.assumptionContainer, { opacity: assumptionOpacity }]}>
        <Text style={styles.text}>Supones que {killer} ha asesinado {victim} en el {room}</Text>
        <View style={styles.buttonsContainer}>
          {victim !== "" && killer !== "" ? (
            <>
              <Pressable style={styles.button} onPress={manageAssumption}>
                <Text style={styles.buttonText}>Confirmar suposición</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => setAssumptionOpacity(0)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </View>
    )
  }
  const manageAssumption = () => {
    setAssumptionOpacity(0);
    // También podrías resetear los estados si es necesario
    setKiller("");
    setVictim("");
    setKillersOpacity(0);
    setCharactersOpacity(0);
  } 
  return (
      <ImageBackground style={styles.container} source={gifSource} resizeMode="cover">
        <View style={styles.envelopeContainer}>
          <Pressable style={styles.envelope} onPress={() => showSection("killers")}>
            <Text style={styles.textEnvelope}>MIS</Text>
            <Text style={styles.plusEnvelope}>+</Text>
          </Pressable>
          <Pressable style={styles.envelope} onPress={() => showSection("characters")}>
            <Text style={styles.textEnvelope}>TE</Text>
            <Text style={styles.plusEnvelope}>+</Text>
          </Pressable>
          <Pressable style={styles.envelope} onPress={() => showSection("")}>
            <Text style={styles.textEnvelope}>RIO</Text>
            <Text style={styles.roomEnvelope}>{room}</Text>
          </Pressable>
        </View>
        {charactersSection()} 
        {assumptionSection()}
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    marginBottom: 60,
  },
  envelopeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 20,
  },
  envelope: {
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 5,
    padding: 10,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  textEnvelope: {
    fontFamily: "Creepster-Regular",
    fontSize: 24,
  },
  plusEnvelope: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
  roomEnvelope: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    width: 70, // Fixed width to avoid overflow
  },
  title: {
    justifyContent: "center",
    width: "90%",
    backgroundColor: "lightblue",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontFamily: "Creepster-Regular",
    fontSize: 20,
  },
  killersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    flexWrap: "wrap",
  },
  charactersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    flexWrap: "wrap",
  },
  characterContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  roomTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    flexWrap: "wrap",
  },
  characterName: {
    fontFamily: "Creepster-Regular",
    fontSize: 12,
  },
  character: {
    height: 175,
    width: 100,
  },
  assumptionContainer: {
    justifyContent: "center",
    width: "90%",
    backgroundColor: "lightblue",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    width: "90%",
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontFamily: "Creepster-Regular",
  },
});