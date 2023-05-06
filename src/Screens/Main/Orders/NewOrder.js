import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import RoundedButton from "../RoundedButton";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { wait } from "../../Utilities/helpers";
let ORDER_PARAMS = {
  email: "",
  idToken: "",
  userID: "",
  carrierType: "",
  coordinates: {},
  destination: "",
  dropoffNumber: "",
  dropoffEmail: "",
  pickupDate: "",
  pickupLocation: "",
  pickupNumber: "",
  orderContent: "",
  description: "",
  price: "",
};

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
export default function NewOrder() {
  const navigation = useNavigation();
  // const cardItem = [
  //     {
  //         title: " Air",
  //         text: "For fast shipping of light and heavy goods internationally by air",
  //         textColor: "#127AC5",
  //          image: require("../../../../assets/Images/PLANE/PLANE3.png"),
  //     },
  //     {
  //         title: "Ferry",
  //         text: "For shipping large good internationally by sea",
  //         textColor: "#127AC5",
  //         image: require("../../../../assets/Images/SHIP/SHIP3.png"),
  //     },
  //     {
  //         title: " Truck",
  //         text: "For moving of heavy loads locally e.g Furnitures",
  //         textColor: "#127AC5",
  //         image: require("../../../../assets/Images/TRUCK/TRUCK3.png"),
  //     },
  //     {
  //         title: " Rider",
  //         text: "For instant delivery locally",
  //         textColor: "#127AC5",
  //         image: require("../../../../assets/Images/BIKE/BIKE3.png"),
  //     },
  // ];

  const [orderParameters, setOrderParameters] = useState(ORDER_PARAMS);
  const orderItem = [
    {
      carrierType: "AIR",
      image: require("../../../../assets/Images/Air/Air3.png"),
    },
    {
      carrierType: "FERRY",
      image: require("../../../../assets/Images/Ferry/Ferry3.png"),
    },
    {
      carrierType: "TRUCK",
      image: require("../../../../assets/Images/Truckk/Truck3.png"),
    },
    {
      carrierType: "RIDE",
      image: require("../../../../assets/Images/Rider/Ride3.png"),
    },
  ];

  useEffect(() => {
    console.log("order pre data", orderParameters);
  });
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.firstText}>Select a carrier type </Text>
          <RoundedButton style={{ backgroundColor: "#E68D41" }} />
        </View>
        {/* {cardItem.map((item, id) => {
                    return (
                        <TouchableOpacity key={id} onPress={() => navigation.navigate('OrderDetails')} >
                            <View style={styles.card}>
                            <View style={styles.textContainer}>
                                <Text style={[styles.title, { color: item.textColor }]}>
                                    {item.title}
                                    </Text>
                                   
                                    <Text style={styles.text}>{item.text}</Text>
                                    <Text>

                                    </Text>
                                </View>
                                <View></View>
                            <View style={styles.imageView}>
                                <Image
                                    style={styles.userImage}
                                    source={item.image}
                                    resizeMode="contain"
                                />
                                </View>
                            </View>
                            
                        </TouchableOpacity>
                    );
                })} */}

        {orderItem.map((item, id) => {
          return (
            <TouchableOpacity
              key={id}
              onPress={() => {
                /* setOrderParameters(prevState => {
                  return {
                    ...prevState, carrierType: item.carrierType
                  }
                })
                wait(2000)
                console.log("orderParameters about to be passed in neworders are: ",orderParameters) */
                orderParameters.carrierType = item.carrierType;
                navigation.navigate("OrderPackageDetail", {
                  orderParameters: orderParameters,
                });
              }}
              style={{
                marginVertical: SCREEN_HEIGHT >= 800 ? 0 : 10,
              }}
            >
              <Image
                style={styles.userImage}
                source={item.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 25,
    backgroundColor: "#F2F5FF",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
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
  headerText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 25,
    color: "#7B84AC",
  },
  card: {
    height: SCREEN_HEIGHT * 0.177,
    width: 386,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 20,
    overflow: "hidden",
  },
  userImage: {
    height: SCREEN_HEIGHT * 0.21,
    width: SCREEN_WIDTH * 0.9,
    resizeMode: "contain",
  },
  imageView: {
    height: SCREEN_HEIGHT * 0.23,
    width: 200,
    // backgroundColor: "yellow",
    overflow: "hidden",
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 25,

    // color: "#E32F8B",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    paddingTop: 10,
    paddingLeft: 7,
    width: SCREEN_WIDTH * 0.6,

    color: "#7B84AC",
  },
  textContainer: {
    right: 0,
  },
  accountCheck: {
    margin: 10,
    padding: 10,
  },
  firstText: {
    fontSize: 18,
    textAlign: "left",
    fontFamily: "Montserrat-Regular",
    color: "#33395C",
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
});
