import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import AuthContainer from "../Auth/AuthComponents/AuthContainer";
import { LinearGradient } from "expo-linear-gradient";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Notifications = ({ navigation }) => {
  return (
    <View>
      <Text>Notifications</Text>
    </View>
  );
};
export default Notifications;
