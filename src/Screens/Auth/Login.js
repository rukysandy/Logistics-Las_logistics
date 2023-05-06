import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { Context as AuthContext } from "../../context/AuthContext"; 
import AxiosCall from "../Utilities/Axios";
import AsyncStorage from "@react-native-async-storage/async-storage";  
import { SecureSave, SecureGet } from "../Utilities/helpers";
import { Formik } from "formik";

import * as yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import PageIndicator from "./AuthComponents/PageIndicator";
//import { ScrollView } from "react-native-gesture-handler";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Login({ navigation }) {
  const [indicator, setIndicator] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(100));
  const [endHeight, setEndHeight] = useState(0);
  const { state } = useContext(AuthContext);
  
  const signIn = async (payload) => {
    setIndicator(true);
    try {
      const r = await firebase
        .auth()
        .signInWithEmailAndPassword(payload["email"], payload["password"]);
      if (r && r.user) { 
        setIndicator(false);
        r.user.getIdToken().then(function (idToken) {
          console.log("token in firebse auth is: ", idToken);
          // It shows the Firebase token now
          const signInData = {
            email: r.user.email,
            userID: r?.user?.uid, 
            idToken, 
          };
 
          SecureSave("signInData", JSON.stringify(signInData))
          //AsyncStorage.setItem("signInData", JSON.stringify(signInData));
        }); 
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        global.userID = r?.user?.uid; 
        state.signedIn = true 
        console.log("gloabl user in login is...",global.userID )
       // console.log("state.signedIn is...",state.signedIn )
      
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        navigation.navigate("MainNavigator", { screen: "Home" });
      } else {
        setIndicator(false);
        console.log(" r in signin error is ", r);
        Alert.alert("something went wrong, pls try again!");
      }
    } catch (err) {
      setIndicator(false);
      console.log("err is ", err);
      Alert.alert("something went wrong, pls try again!");
    }
  }; 

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
    // const user = firebase.auth().currentUser;
    // console.log("firebase user is ", user);
    // setUser(user);
    const keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      keyboardWillShow
    );
    const keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      keyboardWillHide
    );

    return () => {
      console.log("Do some cleanup");
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Animated.View
          style={{
            ...Platform.select({
              ios: {
                paddingTop: 10,
                marginTop: 0,
                //paddingBottom: keyboardHeight,
              },
              android: {
                paddingTop: 10,
                marginTop: 0,
                //paddingBottom: keyboardHeight,
              },
            }),
          }}
        >
          <Image
            style={styles.userImage}
            source={require("../../../assets/Images/arrows.png")}
            resizeMode="contain"
          />
          <View style={styles.contentView}>
            <Text style={styles.headerText}>Log In</Text>
            <Formik
              initialValues={{
                email: "",

                password: "",
              }}
              onSubmit={async (values) => {
                /* console.log("these are values", values);
                Alert.alert(JSON.stringify(values));
                navigation.navigate("MainNavigator", { screen: "NewOrder" }); */
                await signIn(values);
              }}
              validationSchema={yup.object().shape({
                email: yup.string().email().required(),

                password: yup
                  .string()
                  .min(4)
                  .max(10, "Password should not excced 10 chars.")
                  .required(),
              })}
            >
              {({
                values,
                handleChange,
                errors,
                setFieldTouched,
                touched,
                isValid,
                handleSubmit,
              }) => (
                <View style={styles.formContainer}>
                  <Text style={styles.boxLabel}>
                    Email <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.email && errors.email && (
                    <Text style={styles.errorMessage}>{errors.email}</Text>
                  )}

                  <TextInput
                    value={values.email}
                    style={styles.inputStyle}
                    onChangeText={handleChange("email")}
                    onBlur={() => setFieldTouched("email")}
                    placeholder="E-mail"
                  />
                  <Text style={styles.boxLabel}>
                    Password <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.password && errors.password && (
                    <Text style={styles.errorMessage}>{errors.password}</Text>
                  )}
                  <TextInput
                    value={values.password}
                    style={styles.inputStyle}
                    onChangeText={handleChange("password")}
                    placeholder="Password"
                    onBlur={() => setFieldTouched("password")}
                    secureTextEntry={true}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ResetPassWord");
                    }}
                    style={styles.forgotPasswordView}
                  >
                    <Text style={styles.forgotpasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("SignUp");
                    }}
                    style={styles.forgotPasswordView}
                  >
                    <Text style={styles.signUpText}>
                      Don’t have an account?
                      <Text style={styles.subText}>Sign Up </Text>
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    disabled={!isValid}
                    onPress={handleSubmit}
                  >
                    {indicator === true ? (
                      <ActivityIndicator size="large" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </Animated.View>
        <View style={{ height: endHeight }}></View>
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
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.065,
    alignSelf: "center",
  },
  boxLabel: {
    padding: 10,
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#7B84AC",
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
  },
  forgotpasswordText: {
    color: "#127AC5",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  signUpText: {
    color: "#33395C",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  subText: {
    color: "#E68D41",
    fontFamily: "Montserrat-Bold",
  },
  submitButton: {
    height: SCREEN_HEIGHT * 0.065,
    width: SCREEN_WIDTH * 0.95,
    backgroundColor: "#E68D41",
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 35,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  errorMessage: {
    fontSize: 12,
    color: "#FF0D10",
    marginHorizontal: 15,
    paddingHorizontal: 15,
  },
});
