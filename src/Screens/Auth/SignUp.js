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
} from "react-native";
import AuthContainer from "./AuthComponents/AuthContainer";
import AuthSubContainer from "./AuthComponents/AuthSubContainer";
import AuthCard from "./AuthComponents/Authcard";
import PageIndicator from "./AuthComponents/PageIndicator";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SignUp({ navigation }) {
  useEffect(() => {
    console.log("navigation", navigation);
  });
  const cardItem = [
    {
      title: "As a User",
      text: "I want to Send a Package",
      textColor: "#127AC5",
      image: require("../../../assets/Images/user3.png"),
      route: "UserSignUp",
    },
    {
      title: "As a Courier",
      text: "I offer Courier Services",
      textColor: "#E32F8B",
      image: require("../../../assets/Images/shipper3.png"),
      route: "ShipperSignUp",
    },
  ];

  return (
    <AuthContainer>
      <PageIndicator />
      <AuthSubContainer>
        <Text style={styles.headerText}>Sign Up </Text>
        {cardItem.map((item, id) => {
          return (
            <TouchableOpacity
              key={id}
              style={{
                ...styles.card,
                height: SCREEN_HEIGHT * 0.22,
                width: SCREEN_WIDTH * 0.9,
              }}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.imageView}>
                <Image
                  style={styles.userImage}
                  source={item.image}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: item.textColor }]}>
                  {item.title}
                </Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.accountCheck}>
          <Text style={{ ...styles.firstText, alignItems: "center" }}>
            Already Have an Account ?
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.subText}>Login </Text>
            </TouchableOpacity>
          </Text>
        </View>
        {/* <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate("NewOrder")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity> */}
      </AuthSubContainer>

      <StatusBar style="auto" />
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#7B84AC",
  },
  card: {
    height: SCREEN_HEIGHT * 0.24,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    overflow: "hidden",
    marginTop: 20,
  },
  userImage: {
    height: SCREEN_HEIGHT * 0.32,
    width: 150,
    resizeMode: "contain",
  },
  imageView: {
    height: SCREEN_HEIGHT * 0.23,
    width: 180,
    // backgroundColor: "yellow",
    overflow: "hidden",
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    // color: "#E32F8B",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    color: "#7B84AC",
  },
  textContainer: {
    right: 30,
  },
  accountCheck: {
    margin: 10,
    padding: 10,
  },
  firstText: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#33395C",
  },
  subText: {
    color: "#E68D41",
    fontFamily: "Montserrat-Bold",
    marginLeft: 5,
    marginTop: 20,
  },
  submitButton: {
    height: SCREEN_HEIGHT * 0.065,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: "#E68D41",
    borderRadius: 15,
    padding: 10,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
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
