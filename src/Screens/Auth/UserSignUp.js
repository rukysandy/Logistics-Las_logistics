import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { setUpUser } from "../Utilities/firebase-functions";
import { Context as AuthContext } from '../../context/AuthContext';
import { SecureSave, SecureGet } from "../Utilities/helpers";
import AxiosCall from "../Utilities/Axios";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Formik } from "formik";
import * as yup from "yup";
import AuthContainer from "./AuthComponents/AuthContainer";
import AuthSubContainer from "./AuthComponents/AuthSubContainer";
import AuthCard from "./AuthComponents/Authcard";
import PageIndicator from "./AuthComponents/PageIndicator";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function UserSignUp({ navigation }) {
  const { state, AuthenticatedUser } = useContext(AuthContext);
  const [indicator, setIndicator] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(100));
  const [endHeight, setEndHeight] = useState(0);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
 
  const signup = async (payload) => {
    let user = null;
    payload["type"] = "user";
    payload["phoneNumber"] = "+234" + payload["phoneNumber"]; 
      setIndicator(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(async (res) => {
          console.log(" login data is  ", res);
          console.log("Payload", payload);
          user = await firebase.auth().currentUser;
          await user.sendEmailVerification();
          user.getIdToken().then(function (idToken) {
            console.log("token in firebse auth is: ", idToken);
            // It shows the Firebase token now
            global.userID = user?.uid;
            const signInData = {
              email: user?.email,
              userID: user?.uid,
              idToken,
              type:"user",
            };
            SecureSave("signInData", JSON.stringify(signInData));
          }); 
        })
        .then(async (docs) => {
          await delete payload.confirmpassword
          await delete payload.password
          let data = {
            ...payload,
            userID: user?.uid, 
            isAdmin: false, 
            timeCreated: firebase.firestore.Timestamp.fromDate(new Date()),
          };
          setUpUser(data,"User"); 
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          }); 
          setIndicator(false); 
        })
        .then(()=>{ 
          AuthenticatedUser();
          Alert.alert('YOU HAVE SIGNED UP SUCCESSFULLY');
        }) 
        .catch((error) => {
          // Handle Errors here.
          setIndicator(false);
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/weak-password") {
            Alert.alert("The password is too weak.");
          } else {
            Alert.alert(errorMessage);
          }
          console.log(error);
        }); 
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
    const user = firebase.auth().currentUser;
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
    <AuthContainer>
      <PageIndicator />
      <AuthSubContainer>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ textDecorationLine: "underline" }}>Go Back</Text>
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                password: "",
                type: "user",
              }}
              onSubmit={async (values) => {
                console.log("these are values", values);
                // Alert.alert(JSON.stringify(values));
                await signup(values);
                //navigation.navigate("Login");
              }}
              validationSchema={yup.object().shape({
                firstName: yup
                  .string()
                  .required("Please, provide your firstame!"),
                lastName: yup
                  .string()
                  .required("Please, provide your lastName!"),
                email: yup.string().email().required(),
                phoneNumber: yup
                  .string()
                  .required("required")
                  .matches(phoneRegExp, "Phone number is not valid")
                  .min(10, "too short, remove any leading 0")
                  .max(10, "too long. don't use a country code"),
                password: yup
                  .string()
                  .min(6)
                  .max(15, "Password should not excced 15 chars.")
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
                <View
                  style={{ ...styles.formContainer, width: SCREEN_WIDTH * 0.9 }}
                >
                  <Text style={styles.boxLabel}>
                    First Name <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.firstame && errors.firstame && (
                    <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                      {errors.firstName}
                    </Text>
                  )}
                  <TextInput
                    value={values.firstName}
                    style={styles.inputStyle}
                    onChangeText={handleChange("firstName")}
                    onBlur={() => setFieldTouched("firstName")}
                    placeholder=" First Name "
                  />

                  <Text style={styles.boxLabel}>
                    Last Name <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.lastName && errors.lastName && (
                    <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                      {errors.lastName}
                    </Text>
                  )}
                  <TextInput
                    value={values.lastName}
                    style={styles.inputStyle}
                    onChangeText={handleChange("lastName")}
                    onBlur={() => setFieldTouched("lastName")}
                    placeholder="Last Name"
                  />

                  <Text style={styles.boxLabel}>
                    Email <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.email && errors.email && (
                    <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                      {errors.email}
                    </Text>
                  )}

                  <TextInput
                    value={values.email}
                    style={styles.inputStyle}
                    onChangeText={handleChange("email")}
                    onBlur={() => setFieldTouched("email")}
                    placeholder="E-mail"
                  />

                  <Text style={styles.boxLabel}>
                    Phone Number <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                      {errors.phoneNumber}
                    </Text>
                  )}
                  <TextInput
                    value={values.phoneNumber}
                    style={styles.inputStyle}
                    onChangeText={handleChange("phoneNumber")}
                    placeholder="e.g 8050419007 Enter 10 digits only."
                    onBlur={() => setFieldTouched("phoneNumber")}
                  />

                  <Text style={styles.boxLabel}>
                    Password <Text style={styles.important}>*</Text>
                  </Text>
                  {touched.password && errors.password && (
                    <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                      {errors.password}
                    </Text>
                  )}
                  <TextInput
                    value={values.password}
                    style={styles.inputStyle}
                    onChangeText={handleChange("password")}
                    placeholder="Password"
                    onBlur={() => setFieldTouched("password")}
                    secureTextEntry={true}
                  />

                  <Text style={styles.boxLabel}>
                    Confirm Password <Text style={styles.important}>*</Text>
                  </Text>

                  {touched.confirmpassword && errors.confirmpassword && (
                    <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                      {errors.confirmpassword}
                    </Text>
                  )}
                  <TextInput
                    value={values.confirmpassword}
                    style={styles.inputStyle}
                    onChangeText={handleChange("confirmpassword")}
                    placeholder="confirm password"
                    onBlur={() => setFieldTouched("confirmpassword")}
                    secureTextEntry={true}
                  />
                  <KeyboardSpacer />
                  <TouchableOpacity
                    style={styles.submitButton}
                    disabled={!isValid}
                    onPress={handleSubmit}
                  >
                    {indicator === true ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>SIGN UP</Text>
                    )}
                  </TouchableOpacity>
                  {/* <Button
                color="#3740FE"
                title="Submit"
                disabled={!isValid}
                onPress={handleSubmit}
              /> */}
                </View>
              )}
            </Formik>
          </Animated.View>
          <View style={{ height: 50 + endHeight }}></View>
        </ScrollView>
      </AuthSubContainer>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageCard: {
    backgroundColor: "#FFFFFF",
    height: SCREEN_HEIGHT * 0.14,
    width: SCREEN_WIDTH * 0.32,
    borderRadius: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  ProfileImage: {
    height: SCREEN_HEIGHT * 0.09,
    width: SCREEN_WIDTH * 0.12,
  },
  profileCardText: {
    color: "#BCC2DE",
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
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
  },
  boxLabel: {
    padding: 5,
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#7B84AC",
  },
  important: {
    color: "#F44646",
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
  },
  submitButton: {
    height: SCREEN_HEIGHT * 0.065,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: "#E68D41",
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
});
