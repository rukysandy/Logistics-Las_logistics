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

export default function PageIndicator() {
  return (
    <View style={styles.pageIndicator}>
      <View className="active " style={styles.activeIndicatorCard}>
        <Text style={styles.indicatorText}>1</Text>
      </View>
      <View style={styles.IndicatorLine} />
      <View style={styles.indicatorCard}>
        <Text style={[styles.indicatorText, styles.notActiveText]}>2</Text>
      </View>
      <View style={styles.IndicatorLine} />
      <View style={styles.indicatorCard}>
        <Text style={[styles.indicatorText, styles.notActiveText]}>3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageIndicator: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIndicatorCard: {
    height: SCREEN_HEIGHT * 0.032,
    width: SCREEN_WIDTH * 0.075,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  doneIndicatorCard: {},
  indicatorCard: {
    height: SCREEN_HEIGHT * 0.032,
    width: SCREEN_WIDTH * 0.075,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  IndicatorLine: {
    height: 0.5,
    width: SCREEN_WIDTH * 0.3,
    backgroundColor: "#FFFFFF",
  },
  indicatorText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
    color: "#127AC5",
  },
  activeText: {
    color: "#127AC5",
  },
  notActiveText: {
    color: "#FFFFFF",
  },
});
