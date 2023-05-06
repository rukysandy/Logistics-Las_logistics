import React from "react";
import { Image, Text, View, Dimensions } from "react-native";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const Offline = () => {
  return (
    <View
      style={{
        height: 40,
        alignSelf:"center",
        width: SCREEN_WIDTH,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:'red'
      }}
    >
      <Text style={{ color: "white", fontSize: 15,  fontFamily: "Montserrat-Regular" }}>
        You seem to be Offline, pls turn on your data
      </Text>
    </View>
  );
};
export default Offline;
