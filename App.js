import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import Navigation from "./src/Navigation/Navigation";
import TabNavigation from "./src/Navigation/TabNavigation";
import ImageUpload from "./src/Screens/Helpers/imageUpload";
import firebase from "./firebase/firebaseConfig";
import { Provider as AuthProvider } from "./src/context/AuthContext";
export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    await Promise.all([
      Font.loadAsync({
        "Montserrat-Bold": require("./assets/Montserrat/Montserrat-Bold.ttf"),
        "Montserrat-Regular": require("./assets/Montserrat/Montserrat-Regular.ttf"),
        "Montserrat-Light": require("./assets/Montserrat/Montserrat-Light.ttf"),
        "Montserrat-Medium": require("./assets/Montserrat/Montserrat-Medium.ttf"),
        "Montserrat-SemiBold": require("./assets/Montserrat/Montserrat-SemiBold.ttf"),
      }),
    ]);
    setAssetsLoaded(true);
    console.log(" Loaded Asset");
  }

  if (assetsLoaded) {
    return (
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5FF",
    alignItems: "center",
    justifyContent: "center",
  },
});
