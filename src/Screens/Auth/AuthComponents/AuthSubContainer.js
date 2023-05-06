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

export default function AuthSubContainer(props) {
  return <View style={styles.subcontainer}>{props.children}</View>;
}

const styles = StyleSheet.create({
  subcontainer: {
    paddingTop: 50,
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: "#F2F5FF",
    width: SCREEN_WIDTH,
    // borderRadius: 25,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    alignItems: "center",
  },
});
