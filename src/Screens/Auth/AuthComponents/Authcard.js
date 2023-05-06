import React from "react";
import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AuthCard(props) {
  return (
    <TouchableOpacity style={styles.card}>{props.children}</TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: SCREEN_HEIGHT * 0.25,
    width: SCREEN_WIDTH * 0.95,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    overflow: "hidden",
    marginTop: 20,
  },
});
