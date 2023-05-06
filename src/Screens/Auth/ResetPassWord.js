import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Formik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";
import PageIndicator from "./AuthComponents/PageIndicator";
//import { ScrollView } from "react-native-gesture-handler";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ResetPassWord({ navigation }) {
  const [indicator, setIndicator] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(100));
  const [endHeight, setEndHeight] = useState(0);

  const keyboardWillShow = (event) => {
    setEndHeight(60);
    Animated.parallel([
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const keyboardWillHide = (event) => {
    setEndHeight(0);
    Animated.parallel([
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };
  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          style={styles.userImage}
          source={require("../../../assets/Images/arrows.png")}
          resizeMode="contain"
        />
        <View style={styles.contentView}>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text
              style={{
                textDecorationLine: "underline",
                alignSelf: "center",
                marginVertical: 10,
              }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Reset Password</Text>

          <Text style={styles.boxLabel}>
            Phone/Email <Text style={styles.important}>*</Text>
          </Text>
          <TextInput style={styles.inputStyle} placeholder=" Enter  Email " />

          <View style={styles.forgotPasswordView}>
            <Text style={styles.resetText}>
              You will receive a password reset confirmation email/SMS
            </Text>
          </View>
          {/* <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.submitButton}
            disabled={indicator}
            onPress={() => {}}
          >
            {indicator === true ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F2F5FF",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  userImage: {
    height: SCREEN_HEIGHT * 0.59,
    width: SCREEN_WIDTH * 1,
    right: 130,

    // resizeMode: "contain",
  },
  contentView: {
    width: "100%",
    bottom: 240,
  },
  headerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    color: "#7B84AC",
    alignSelf: "center",
    marginBottom: 35,
  },
  inputStyle: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#127AC533",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 12,
    marginBottom: 10,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.065,
    alignSelf: "center",
  },
  boxLabel: {
    padding: 15,
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#7B84AC",
    marginHorizontal: 10,
  },
  important: {
    color: "#F44646",
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
  },
  forgotPasswordView: {
    width: "100%",
    alignItems: "center",
    marginVertical: 30,
    justifyContent: "center",
  },

  resetText: {
    color: "#33395C",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    marginHorizontal: 10,
  },

  submitButton: {
    height: SCREEN_HEIGHT * 0.065,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: "#E68D41",
    borderRadius: 15,
    marginTop: 55,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
});
