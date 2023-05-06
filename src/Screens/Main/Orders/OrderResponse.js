import React, { useState, useEffect, useRef } from "react";
import  { Paystack , paystackProps}  from 'react-native-paystack-webview';

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
import firebase from "firebase";
import "firebase/firestore";
import { CheckBox } from "react-native-elements";
import { SecureGet } from "../../Utilities/helpers";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;


export default function OrderResponse({ route, navigation }) {
  const [dchecked, setDChecked] = React.useState(true);
  const [oChecked, setOChecked] = React.useState(true);
  const [orderParameters, setOrderParameters] = useState({});
  const [actualTotal, setActualTotal] = useState(0);
  const [openpay, setOpenpay] = useState(false);
  const [email, setEmail] = useState("");
  const [idToken, setIDToken] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const cResponses = [
    { price: 3000, pickup: "14/10/2021", dropoff: "21/10/2021" },
    { price: 3000, pickup: "14/10/2021", dropoff: "21/10/2021" },
    { price: 3000, pickup: "14/10/2021", dropoff: "21/10/2021" },
  ];
  function PayByPaystack() {
    return (
      <View style={{ flex: 1 }}>
        <Paystack  
          paystackKey="your-public-key-here"
          amount={'25000.00'}
          billingEmail="paystackwebview@something.com"
          activityIndicatorColor="green"
          onCancel={(e) => {
            setOpenpay(false)
            // handle response here
          }}
          onSuccess={(res) => {
              setOpenpay(false)
            // handle response here
          }}
          autoStart={true}
        />
      </View>
    );
  }
  const getSignInData = async () => {
    console.log("calling setSignInData...");
    try {
      const user = await firebase.auth().currentUser;
      console.log("firebase user is ", user?.name);
      setPhone(user?.phoneNumber);
      setName(user?.name);
      let r = await SecureGet("signInData");
      // console.log('r in nav is ', r)
      if (r !== undefined) {
        let r2 = JSON.parse(r);
        setEmail(r2.email);
        setIDToken(r2.idToken);
        console.log("userid in nav is...", global.userID);
      }
    } catch (err) {
      console.log("had issues fetching data in orderresponse ", err);
    }
  };
  useEffect(() => {
    if (route?.params?.orderParameters) {
      setOrderParameters(route?.params?.orderParameters);
    }
    getSignInData();
    console.log(
      "details passed to OrderResponse... ",
      route?.params?.orderParameters
    );
  }, [email, phone, name]);

  const cardItem = [
    {
      title: "God's Grace Logistics",
      text: "Orders Completed",
      orderno: "10",
      rating: "Rating",
      bgcol: "#58E5B4",
      // image: require("../../../../assets/Images/PLANE/PLANE3.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.firstText}>Order Request </Text>
        </View>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text style={styles.text}>Locations</Text>
            <Image
              source={require("../../../../assets/Images/BIKE/BIKE.png")}
              style={styles.bikeImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bluehighcard}>
            <View style={styles.textView}>
              <Image
                style={styles.locationImage}
                resizeMode="contain"
                source={require("../../../../assets/Images/LOCATIONFROM/FROM.png")}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>From</Text>
              <Text style={styles.subtext}>
                {" "}
                {orderParameters?.pickupLocation || "..."}{" "}
              </Text>
            </View>
          </View>
          <View style={styles.bluecard}>
            <View style={styles.textView}>
              <Text style={styles.title2}>+234</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.subtext}>
                {orderParameters?.pickupNumber || "..."}
              </Text>
            </View>
          </View>
          <View style={styles.pinkhighcard}>
            <View style={styles.textView}>
              <Image
                style={styles.locationImage}
                resizeMode="contain"
                source={require("../../../../assets/Images/LOCATIONFROM/HOMEICON.png")}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.pinktitle}>To:</Text>
              <Text style={styles.subtext}>
                {orderParameters?.destination || "..."}
              </Text>
            </View>
          </View>
          <View style={styles.pinkcard}>
            <View style={styles.textView}>
              <Text style={styles.pinktitle}>+234</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.subtext}>
                {orderParameters?.dropoffNumber || "..."}
              </Text>
            </View>
          </View>
          <View style={styles.pinkcard}>
            <View style={styles.textView}>
              <Text style={styles.pinktitle}>Email: </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.subtext}>
                {orderParameters?.dropoffEmail || "..."}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 18 }}>
          <Text style={styles.firstText}>Courier Responses </Text>
        </View>
        {cResponses.map((item, id) => {
          return (
            <View style={styles.minicard} key={id}>
              <View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.datetitle}>Price </Text>
                    <Text style={styles.datetitle2}>{item.price} </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.datetitle}>Pick Up Date </Text>
                    <Text style={styles.datetitle}>{item.pickup} </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.ddatetitle}>Drop Off Date </Text>
                    <Text style={styles.ddatetitle}>{item.dropoff} </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    setActualTotal(item.price);
                    setOpenpay(true);
                  }}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        {openpay == true && <PayByPaystack />}

        <View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }}></View>
      </ScrollView>
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

  card: {
    height: SCREEN_HEIGHT * 0.5,
    width: 386,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
    marginTop: 20,
    overflow: "hidden",
  },
  cardd: {
    backgroundColor: "#ffffff",
    height: 230,
    width: 185,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    padding: 15,
    // marginHorizontal: 12,
    // margingRight: 10
  },
  bluetopcard: {
    height: SCREEN_HEIGHT * 0.16,
    width: 386,
    backgroundColor: "#1D7CC2",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    overflow: "hidden",
  },
  minicard: {
    width: 386,
    backgroundColor: "#FFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: 8,
    marginVertical: 6,
    overflow: "hidden",
  },
  minicardd: {
    backgroundColor: "#ffffff",
    height: 80,
    width: 85,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
    padding: 15,
  },

  top: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    right: 100,
  },

  bluecard: {
    height: 50,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#FFFFFF",
    borderColor: "#127AC5",
    borderWidth: 1,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingLeft: 0,
  },
  ordercontentcard: {
    height: 50,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#F2F5FF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginLeft: 20,
    paddingLeft: 20,
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
    height: 50,
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
  imageView: {
    height: SCREEN_HEIGHT * 0.23,
    width: 200,
    // backgroundColor: "yellow",
    overflow: "hidden",
  },
  textView: {
    width: 150,
    overflow: "hidden",
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#127AC5",
    textAlign: "left",
  },
  title3: {
    color: "#33395C",
    fontSize: 18,
    width: 160,
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingTop: 7,
    // color: "#E32F8B",
  },
  title4: {
    color: "#127AC5",
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    paddingTop: 4,
    // color: "#E32F8B",
  },
  normaltext: {
    color: "#7B84AC",
    fontSize: 14,
    width: 160,
    alignSelf: "flex-start",
    paddingTop: 7,
    // color: "#E32F8B",
  },
  topnormaltext: {
    fontSize: 18,
    color: "#ffffff",
  },
  whitetext: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
  },
  boldtext: {
    fontSize: 49,
    fontWeight: "bold",
    color: "#ffffff",
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
    textAlign: "left",
    paddingLeft: 20,
    width: SCREEN_WIDTH * 0.67,
    color: "#7B84AC",
  },
  subtext: {
    color: "#BCC2DE",
    width: SCREEN_WIDTH * 0.4,
    fontSize: 14,
  },
  ordersubtext: {
    color: "#BCC2DE",
    width: SCREEN_WIDTH * 0.785,
    fontSize: 14,
  },

  firstText: {
    fontSize: 18,
    textAlign: "left",
    fontFamily: "Montserrat-Regular",
    color: "#33395C",
  },

  submitButton: {
    backgroundColor: "#127AC5",
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    marginLeft: 10,

    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#E32F8B",
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    width: 386,
    alignItems: "center",
    justifyContent: "center",
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
    marginLeft: 10,
  },
  datetitle2: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#127AC5",
    textAlign: "left",
    marginTop: 20,
    marginLeft: 10,
  },
  ddatetitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#E32F8B",
    textAlign: "left",
    marginTop: 10,
    marginLeft: 10,
  },
});
