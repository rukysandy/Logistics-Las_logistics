import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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
import { SecureSave, SecureGet } from "../Utilities/helpers";
import AxiosCall from "../Utilities/Axios";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Formik } from "formik";
import * as yup from "yup";
import AuthContainer from "../Auth/AuthComponents/AuthContainer";
import {
  SimpleLineIcons,
  Entypo,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { Switch } from "react-native-elements";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function EditProfileScreen({ route, navigation }) {
  const [indicator, setIndicator] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(100));
  const [endHeight, setEndHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [checkTruck, setCheckTruck] = useState(false);
  const [checkBike, setCheckBike] = useState(false);
  const [checkAir, setCheckAir] = useState(false);
  const [checkShip, setCheckShip] = useState(false);
  const [items, setItems] = useState([
    {
      id: 1,
      label: "+234",
      value: "+234",
      icon: () => (
        <Image
          source={require("../../assets/nigeria.png")}
          style={{ height: 20, width: 20 }}
          resizeMode="contain"
        />
      ),
    },

    {
      id: 2,
      label: "+233",
      value: "+233",
      icon: () => (
        <Image
          source={require("../../assets/ghana.png")}
          style={{ height: 20, width: 20 }}
          resizeMode="contain"
        />
      ),
    },
  ]);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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

    const submitEdit = async (payload) => {
      console.log("Payload", payload);
    };

    return () => {
      console.log("Do some cleanup");
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (route.params.userData) {
      console.log("User  Data ", route.params.userData);
      // setUserData(route.params.userData);
    }
  }, [route.params.userData]);

  const toggleSwitch = (checkType) => {
    if (checkType === "Truck") {
      setCheckTruck(!checkTruck);
    } else if (checkType === "Bike") {
      setCheckBike(!checkBike);
    } else if (checkType === "Air") {
      setCheckAir(!checkAir);
    } else if (checkType === "Ship") {
      setCheckShip(!checkShip);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Header}>
        <TouchableOpacity
          style={{ right: 20, padding: 10 }}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="chevron-left" size={24} color="#127AC5" />
        </TouchableOpacity>
        <Text style={styles.mainHeadertext}>Edit Profile</Text>
        <TouchableOpacity style={{ padding: 10 }}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
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
              companyName: "",
              contactPerson: "",

              phoneNumber: "",

              // type: "üser",
            }}
            onSubmit={async (values) => {
              console.log("these are values", values);
              Alert.alert(JSON.stringify(values));
              // await submitEdit(values);
              //navigation.navigate("Login");
            }}
            validationSchema={yup.object().shape({
              companyName: yup
                .string()
                .required("Please, provide your companyName!"),
              contactPerson: yup
                .string()
                .required("Please, provide your contactPerson Name"),

              phoneNumber: yup
                .string()
                .required("required")
                .matches(phoneRegExp, "Phone number is not valid")
                .min(10, "too short")
                .max(11, "too long"),
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
                <View
                  style={{
                    width: "55%",
                    marginBottom: 20,

                    backgroundColor: "#FFFFFF",
                    borderRadius: 15,

                    padding: 20,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                    }}
                  >
                    <Text style={styles.toggletextStyle}>Courier Type</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={styles.toggletextStyle}>Truck</Text>

                    <Switch
                      value={checkTruck}
                      onValueChange={(value) => setCheckTruck(value)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={styles.toggletextStyle}>Bike</Text>

                    <Switch
                      value={checkBike}
                      onValueChange={(value) => setCheckBike(value)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={styles.toggletextStyle}>Air</Text>
                    <Switch
                      value={checkAir}
                      onValueChange={(value) => setCheckAir(value)}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text style={styles.toggletextStyle}>Ship</Text>
                    <Switch
                      value={checkShip}
                      onValueChange={(value) => setCheckShip(value)}
                    />
                  </View>
                </View>
                <Text style={styles.boxLabel}>
                  Company Name <Text style={styles.important}>*</Text>
                </Text>
                {touched.companyName && errors.companyName && (
                  <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                    {errors.companyName}
                  </Text>
                )}
                <TextInput
                  value={values.companyName}
                  style={styles.inputStyle}
                  onChangeText={handleChange("companyName")}
                  onBlur={() => setFieldTouched("companyName")}
                  placeholder="Company  Name"
                />

                <Text style={styles.boxLabel}>
                  Last Name <Text style={styles.important}>*</Text>
                </Text>
                {touched.contactPerson && errors.contactPerson && (
                  <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                    {errors.contactPerson}
                  </Text>
                )}
                <TextInput
                  value={values.contactPerson}
                  style={styles.inputStyle}
                  onChangeText={handleChange("contactPerson")}
                  onBlur={() => setFieldTouched("contactPerson")}
                  placeholder="Contact person"
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
                  placeholder="Phone Number"
                  onBlur={() => setFieldTouched("phoneNumber")}
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
                    <Text style={styles.buttonText}>SUBMIT</Text>
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
    paddingBottom: 30,
  },
  Header: {
    marginTop: 35,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    paddingHorizontal: 30,
  },
  mainHeadertext: {
    padding: 10,
    color: "#7B84AC",
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
  },

  saveText: { color: "#127AC5", fontFamily: "Montserrat-Bold", fontSize: 16 },

  profileImageCard: {
    backgroundColor: "#FFFFFF",
    height: SCREEN_HEIGHT * 0.14,
    width: SCREEN_WIDTH * 0.32,
    borderRadius: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 30,
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
  phoneInputStyle: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#127AC533",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 12,
    marginBottom: 10,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.065,
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
  passwordReset: {
    color: "#7B84AC",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    marginVertical: 15,
  },
  toggletextStyle: {
    color: "#7B84AC",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
});
