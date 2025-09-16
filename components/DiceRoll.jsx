import React, { useEffect, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

export function DiceRoll() {
  const [diceValue, setDiceValue] = useState(0);
  const [rotation] = useState(new Animated.Value(0));
  const router = useRouter();
  useEffect(() => {
      if (diceValue === 0) return; // Ignora el valor inicial
      const timer = setTimeout(() => {
        router.push({
          pathname: "/firstFloor",
          params: { diceValue: diceValue.toString() }, // Convierte a string explícitamente
        });
      }, 2000);
      return () => clearTimeout(timer);
    }, [diceValue]);
  // Genera el dado al montar
  useEffect(() => {
    rollDice();
  }, []);

  // Cuando diceValue cambia y es válido, redirige
  useEffect(() => {
    if (diceValue === 0) return; // Ignora el valor inicial
    const timer = setTimeout(() => {
      router.push({
        pathname: "/firstFloor",
        params: { diceValue }, // ahora sí pasará el valor correcto
      });
    }, 2000); // 2 segundos para animación
    return () => clearTimeout(timer);
  }, [diceValue]);

  const rollDice = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);

    rotation.setValue(0);
    Animated.timing(rotation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderDiceFace = (value) => {
    switch (value) {
      case 1:
        return <View style={styles.dot} />;
      case 2:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      case 3:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      case 4:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotTopRight]} />
            <View style={[styles.dot, styles.dotBottomLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      case 5:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotTopRight]} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotBottomLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      case 6:
        return (
          <>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotTopRight]} />
            <View style={[styles.dot, styles.dotMiddleLeft]} />
            <View style={[styles.dot, styles.dotMiddleRight]} />
            <View style={[styles.dot, styles.dotBottomLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/table-back.png")}
    >
      <View style={styles.header}>
        <Text style={styles.header_text}>Misterio</Text>
      </View>
      <Animated.View style={[styles.dice, { transform: [{ rotate: spin }] }]}>
        {renderDiceFace(diceValue)}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: {
    height: 80,
    width: 200,
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 300,
  },
  header_text: { fontFamily: "Creepster-Regular", fontSize: 55 },
  dice: {
    width: 100,
    height: 100,
    backgroundColor: "#e3dac9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
    position: "relative",
    marginTop: 50,
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: "black",
    borderRadius: 10,
    position: "absolute",
  },
  dotTopLeft: { top: 10, left: 10 },
  dotTopRight: { top: 10, right: 10 },
  dotBottomLeft: { bottom: 10, left: 10 },
  dotBottomRight: { bottom: 10, right: 10 },
  dotMiddleLeft: { top: 40, left: 10 },
  dotMiddleRight: { top: 40, right: 10 },
});
