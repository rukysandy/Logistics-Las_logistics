import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext, useRef } from "react";
import RoundedButton from "../../RoundedButton";
import { CheckBox } from "react-native-elements";
import firebase from "firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Constants from "expo-constants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Input } from "react-native-elements";
const API_KEY = "AIzaSyDKbzMKjL7Xk7lvKFCdMa1_IZIQXMWGV84";
import "firebase/firestore";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

//import firebase from "firebase";
import "firebase/firestore";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function OrderDetailsPage({ route, navigation }) {
  const [dchecked, setDChecked] = useState(false);
  const [eChecked, setEChecked] = useState(false);
  const [lChecked, setLChecked] = useState(false);
  const [oChecked, setOChecked] = useState(false);
  const [Checked, setChecked] = useState("");
  const [detailsText, setDetailsText] = useState("");
  const [minimumDate, setMinimumDate] = useState(new Date());
  const [pickupScheduledDate, setPickupScheduledDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [orderParameters, setOrderParameters] = useState({});

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setPickupScheduledDate(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    );
    console.warn(
      "A date has been picked: ",
      date,
      " time is: ",
      date.toLocaleTimeString("en-US")
    );
    setOrderParameters((prevState) => {
      return {
        ...prevState,
        pickupDate: date.toString(),
      };
    });
    hideDatePicker();
  };

  useEffect(() => {
    console.log("screenWidth", SCREEN_WIDTH);
    //fetch user details
    const user = firebase.auth().currentUser;
    console.log("user in useeffect orderdetail is ", user);
    if (route?.params?.orderParameters) {
      setOrderParameters(route?.params?.orderParameters);
      let data = route?.params?.orderParameters;
      (data["email"] = user?.email), (data["userID"] = global?.userID);
      setOrderParameters(data);
    }
    console.log("OrderParameters are ... ", route?.params?.orderParameters);
    console.log(
      "OrderParameters set with new values are ... ",
      orderParameters
    );
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode>
        <View style={styles.card}>
          <View style={styles.bluecard}>
            <View style={{ ...styles.textView, marginTop: 5 }}>
              <Text style={styles.title2}>+234</Text>
            </View>
            <View style={styles.textContainer}>
              <TextInput
                style={{ minHeight: 30 }}
                placeholder="Pick up Phone Number"
                onChangeText={(text) => {
                  setOrderParameters((prevState) => {
                    return {
                      ...prevState,
                      pickupNumber: text,
                    };
                  });
                }}
                // defaultValue={text}
              />
            </View>
          </View>

          <View style={styles.pinkcard}>
            <View style={{ ...styles.textView, marginTop: 5 }}>
              <Text style={styles.pinktitle}>+234</Text>
            </View>
            <View style={styles.textContainer}>
              <TextInput
                style={{ minHeight: 30 }}
                placeholder="Drop Off Phone Number"
                onChangeText={(text) => {
                  setOrderParameters((prevState) => {
                    return {
                      ...prevState,
                      dropoffNumber: text,
                    };
                  });
                }}
                // defaultValue={text}
              />
            </View>
          </View>
          <View style={styles.pinkcard}>
            <View style={{ ...styles.textView, marginTop: 5 }}>
              <Text style={styles.pinktitle}>Email: </Text>
            </View>
            <View style={styles.textContainer}>
              <TextInput
                style={{ minHeight: 30 }}
                placeholder="Drop off Email (Optional)"
                onChangeText={(text) => {
                  setOrderParameters((prevState) => {
                    return {
                      ...prevState,
                      dropoffEmail: text,
                    };
                  });
                }}
                // defaultValue={text}
              />
            </View>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={minimumDate}

            // maximumDate={maximumDate}
          />
        </View>

        <View>
          <TouchableOpacity
            style={styles.submitButton}
            // onPress={() => { submitOrder(orderParameters).then(() => navigation.navigate("OrderConfirmation", { orderParameters: orderParameters }))}}
            onPress={() =>
              navigation.navigate("AddDestination", {
                orderParameters: orderParameters,
              })
            }
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <View style={{ height: 100 }}></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 25,
    // paddingHorizontal: 10,
    backgroundColor: "#F2F5FF",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  card: {
    //height: SCREEN_HEIGHT * 0.5,
    paddingVertical: 10,
    paddingBottom: 25,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
    marginTop: 20,
    overflow: "hidden",
    alignSelf: "center",
  },
  minicard: {
    marginVertical: SCREEN_HEIGHT >= 800 ? 0 : 10,
    height: SCREEN_HEIGHT >= 800 ? SCREEN_HEIGHT * 0.2 : SCREEN_HEIGHT * 0.3,
    // height: SCREEN_HEIGHT * 0.2,
    width: 160,
    backgroundColor: "#FFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 20,
    overflow: "hidden",
  },
  cardcard: {
    height: SCREEN_HEIGHT * 0.5,
    width: 386,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    marginTop: 20,
    overflow: "hidden",
  },
  top: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignSelf: "flex-start",
  },

  bluecard: {
    paddingVertical: 8,
    width: SCREEN_WIDTH * 0.8,
    // marginVertical:
    //   SCREEN_WIDTH >= 420 ? SCREEN_WIDTH * 0.8 : SCREEN_WIDTH * 0.5,
    paddingHorizontal: 5,
    backgroundColor: "#F2F5FF",
    borderColor: "#127AC533",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingLeft: 0,
    height: 47,
  },
  bluehighcard: {
    height: 70,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#F2F5FF",
    borderColor: "#127AC533",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  pinkcard: {
    //height: 50,
    paddingVertical: 8,
    width: SCREEN_WIDTH * 0.8,
    paddingHorizontal: 5,
    backgroundColor: "#FFEFF7",
    borderColor: "#E32F8B33",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    height: 47,
  },
  pinkhighcard: {
    height: 70,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#FFEFF7",
    borderColor: "#E32F8B33",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  userImage: {
    height: SCREEN_HEIGHT * 0.35,
    width: 150,
    resizeMode: "contain",
  },
  bikeImage: {
    height: SCREEN_HEIGHT * 0.045,
    width: 40,
    resizeMode: "contain",
  },
  locationImage: {
    height: SCREEN_HEIGHT * 0.045,
    width: 20,
    resizeMode: "contain",
  },
  imageView: {
    height: SCREEN_HEIGHT * 0.23,
    width: 200,
    // backgroundColor: "yellow",
    overflow: "hidden",
  },
  textView: {
    width: 50,
    overflow: "hidden",
    alignSelf: "flex-start",
    alignItems: "center",
    marginLeft: 5,
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#127AC5",
    textAlign: "left",
  },
  pinktitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#E32F8B",
    textAlign: "left",
  },
  title2: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#127AC5",
    textAlign: "left",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    paddingTop: 10,
    textAlign: "left",
    paddingLeft: 2,
    width: SCREEN_WIDTH * 0.67,
    color: "#7B84AC",
  },
  lowertext: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    paddingTop: 10,
    textAlign: "center",
    paddingLeft: 2,
    width: SCREEN_WIDTH * 0.67,
    color: "#7B84AC",
  },
  subtext: {
    color: "#BCC2DE",
    width: SCREEN_WIDTH * 0.38,
    fontSize: 14,
  },

  firstText: {
    fontSize: 18,
    textAlign: "left",
    fontFamily: "Montserrat-Regular",
    color: "#33395C",
  },

  submitButton: {
    backgroundColor: "#E68D41",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    width: SCREEN_WIDTH * 0.9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SCREEN_HEIGHT >= 800 ? SCREEN_HEIGHT * 0.2 : 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  datetitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#127AC5",
    textAlign: "left",
    marginTop: 20,
  },
});
