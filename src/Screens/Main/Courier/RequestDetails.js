import React, { useState, useEffect } from "react";
import { CheckBox } from "react-native-elements";
import { SecureGet } from "../../Utilities/helpers";
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

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
export default function RequestDetails({ route, navigation }) {
  const [dchecked, setDChecked] = React.useState(true);
  const [oChecked, setOChecked] = React.useState(true);
  const [orderParameters, setOrderParameters] = useState({});
  const getSignInData = async () => {
    console.log("calling setSignInData...");
    try {
      let r = await SecureGet("signInData");

      if (r !== undefined) {
        let r2 = JSON.parse(r);
        //setUserID(r2.idToken);
        //global.userID = r2.userID;
        //console.log('r3 in orderconfirmation is ', r2)
        orderParameters.idToken = r2?.idToken;
        orderParameters.email = r2?.email;
      }
    } catch (err) {
      console.log("Had issues fetching data. pls try again! ", err);
      Alert.alert("Had issues fetching data. pls try again! ");
    }
  };
  useEffect(() => {
    if (route?.params?.orderParameters) {
      setOrderParameters(route?.params?.orderParameters);
    }
    getSignInData();
    console.log(
      "details passed to OrderConfirmation... ",
      route?.params?.orderParameters
    );
  });

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
          <View style={styles.bluecard}>
            <View style={styles.textContainer}>
              <TextInput
                style={{ minHeight: 30 }}
                placeholder="Enter Price"
                onChangeText={(text) => (orderParameters.pickupNumber = text)}
                // defaultValue={text}
              />
            </View>
          </View>
          {/* <View style={styles.pinkcard}>
                        <View style={styles.textView}>
                            <Text style={styles.pinktitle}>+234</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.subtext}>{orderParameters?.dropoffNumber || "..."}</Text>

                        </View>
                    </View>
                    <View style={styles.pinkcard}>
                        <View style={styles.textView}>
                            <Text style={styles.pinktitle}>Email: </Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.subtext}>{orderParameters?.dropoffEmail || "..."}</Text>
                        </View>

                    </View> */}
        </View>

        <View style={styles.minicard}>
          <Text style={styles.lowertext}>Order Content</Text>
          <View style={{ paddingTop: 10 }}>
            <CheckBox
              title="Documents"
              checked={dchecked}
              onPress={() => setDChecked(!dchecked)}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                textAlign: "left",
                flexDirection: "row",
                alignSelf: "flex-start",
                paddingVertical: 0,
              }}
            />

            <CheckBox
              title="Others"
              checked={oChecked}
              onPress={() => setOChecked(!oChecked)}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                textAlign: "left",
                flexDirection: "row",
                alignSelf: "flex-start",
                paddingVertical: 0,
              }}
            />
            <View style={styles.ordercontentcard}>
              <View>
                <Text style={styles.ordersubtext}>
                  I am also shipping some clothes with the documents
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() =>
              navigation.navigate("OrderSuccessful", {
                orderParameters: orderParameters,
              })
            }
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
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
    height: SCREEN_HEIGHT * 0.35,
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
    height: SCREEN_HEIGHT * 0.22,
    width: 386,
    backgroundColor: "#FFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: 10,
    marginVertical: 20,
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
    padding: 20,
    marginTop: 20,
    width: 386,
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
});
