import React, { useState, useEffect } from "react";
import { CheckBox } from "react-native-elements";
import { SecureGet, wait } from "../../Utilities/helpers";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"; 
import AxiosCall from "../../Utilities/Axios";
import { collection, query, where, getDocs } from "firebase/firestore";
import firebase from "firebase";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MyRequestDetails({ route, navigation }) {
  const [dchecked, setDChecked] = React.useState(true);
  const [oChecked, setOChecked] = React.useState(true);
  const [orderParameters, setOrderParameters] = useState();
  const [indicator, setIndicator] = useState(false);
  const [idToken, setIDToken] = useState("")
  const [minimumDate, setMinimumDate] = useState(new Date());
  const [maximumDate, setMaximumDate] = useState(new Date());
  const [scheduleType, setScheduleType] = useState("PickUp");
  const [pickupScheduledDate, setPickupScheduledDate] = useState("");
  const [pickupScheduledTime, setPickupScheduledTime] = useState("");
  const [dropoffScheduledDate, setDropoffScheduledDate] = useState("");
  const [dropoffScheduledTime, setDropoffScheduledTime] = useState("");
  const [price, setPrice] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showInputData, setShowInputData] = useState(false);

  
  const updateOrderRequest = async () => {
    setIndicator(true);  
   
    try {
        const courierResponse = {
            courierID: global.userID,
            price: parseInt(price),
            orderID: orderParameters.id,
            scheduledDropOffDate: dropoffScheduledDate,
          };
        
          const responseObj = {
            idToken,
            email: global.email,
            type: "courierResponse",
            courierID: global.userID,
            orderID: orderParameters.id,
            price: parseInt(price),
            scheduledDropOffDate: dropoffScheduledDate,
            courierResponse,
          };
      console.log("responseObj IS ", responseObj);
      const requestObj = {
        method: "POST",
        path: "updateOrders",
        data: responseObj,
      };
      const res = await AxiosCall(requestObj);

      console.log("response", res);
      /* msg: "RESPONDED_TO_NEW_ORDER",
        order: orderID, */
      if (res.msg === "RESPONDED_TO_NEW_ORDER") {
        setTimeout(function () {
          setIndicator(false);
          navigation.goBack();
        }, 500);
      } else {
        Alert.alert("Not successful");
        console.log("response from Las", res);
      }
      setIndicator(false);
    } catch (err) {
      setIndicator(false);
      console.log("ERROR: ", err);
      Alert.alert("something went wrong. pls try again later");
    }
  };
  const updateRequest = (req) => {
    try {
      /* 
      firebase
        .firestore()
        .collection("Orders")
        .doc(req.id)
        .get()
        .then((doc) => {
          let newDoc = doc.data();
          let responseARRAY = [];
          responseARRAY.push({
            courierID: global.userID,
            pickupScheduledDate,
            pickupScheduledTime,
            dropoffScheduledDate,
            dropoffScheduledTime,
            price,
          });
          console.log("responseARRAY to be added is ", responseARRAY);
          firebase
            .firestore()
            .collection("Orders")
            .doc(req.id)
            .update({ courierResponse: responseARRAY });
          setShowInputData(false);
        }); */
    } catch (err) {
      console.log("err ", err);
      Alert.alert("something went wrong! Pls try again...", err);
    }
  };
   
  useEffect(() => {
    if (route?.params?.orderParameters) {
      // console.log("orderParameters on myrequestdetails ", route?.params?.orderParameters)
      setOrderParameters(route?.params?.orderParameters);
      setIDToken(global.idToken)
    }
    
    //getSignInData()
    console.log(
      "details passed to MyRequestDetails in state... ",
      orderParameters," and idToken is ", idToken
    );
  }, [orderParameters, idToken]);
/* useEffect(()=>{
    getIDtoken()
}) */
  const fetchDatabyID = (id) => {
    try {
      if (id)
        firebase
          .firestore()
          .collection("Orders")
          .doc(id)
          .get()
          .then((doc) => {
            let newDoc = doc.data();
            let response = newDoc?.courierResponse;
            // console.log("response is ", response)
            if (Array.isArray(response) && response.length > 0) {
              //Does this user have a response in this array of responses?
              let val = response.filter((item) => {
                if (item.courierID === global.userID) return true;
              });
              // console.log(" user value in response is ", val);
              if (val) {
                setPrice(val[0].price);
                setPickupScheduledDate(val[0].pickupScheduledDate);
                setDropoffScheduledDate(val[0].dropoffScheduledDate);
                setPickupScheduledTime(val[0].pickupScheduledTime);
                setDropoffScheduledTime(val[0].dropoffScheduledTime);
                setShowInputData(false);
              } else {
                setShowInputData(true);
              }
            } else {
              setShowInputData(true);
            }
          });
    } catch (err) {
      console.log("error fetching data by id ", err);
    }
  };
  /* useEffect(() => {
    
    let id = route?.params?.orderParameters.id;
    console.log(" order is ", id, "on myrequestdetails screen");
    fetchDatabyID(id);
  }, [orderParameters]); */

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    console.log("scheduletype selected is: ", scheduleType);
    scheduleType === "PickUp"
      ? setPickupScheduledDate(
          `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        )
      : setDropoffScheduledDate(
          `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        );
    /*  scheduleType === "PickUp"
      ? setPickupScheduledTime(date.toLocaleTimeString("en-US"))
      : setDropoffSScheduledTime(date.toLocaleTimeString("en-US")); */
    //setScheduledDate(date)
    console.warn(
      "A date has been picked: ",
      date,
      " time is: ",
      date.toLocaleTimeString("en-US")
    );
    hideDatePicker();
  };

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
          <Text style={styles.firstText}>Order Request</Text>
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
                style={{ ...styles.locationImage, marginLeft: 10 }}
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
                style={{ ...styles.locationImage, marginLeft: 10 }}
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

        {showInputData && (
          <View style={styles.card}>
            <View style={styles.bluecard}>
              <View style={styles.textContainer}>
                <TextInput
                  style={{ minHeight: 30 }}
                  placeholder="Enter Price"
                  onChangeText={(text) => setPrice(text)}
                  keyboardType="numeric"
                  value={price}
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
            <TouchableOpacity
              onPress={() => {
                setScheduleType("PickUp");
                showDatePicker();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.datetitle}>Pick Up Date </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#1A315C",
                    marginTop: 20,
                    textAlign: "left",
                  }}
                >
                  {`${pickupScheduledDate.toString()}    ${pickupScheduledTime.toString()}` ||
                    "Tap to select. e.g 02 Jan 2020"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setScheduleType("DropOff");
                showDatePicker();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.ddatetitle}>Drop Off Date </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#1A315C",
                    marginTop: 20,
                    textAlign: "left",
                  }}
                >
                  {`${dropoffScheduledDate.toString()}   ` ||
                    "Tap to select. e.g 02 Jan 2020"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {!showInputData && (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.editImage}
              onPress={() => setShowInputData(!showInputData)}
            >
              <Image
                style={styles.editImage}
                source={require("../../../assets/draw.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.blueCard}>
              <Text style={styles.title3}>{price}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.datetitle}>Pick Up Date </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#1A315C",
                  marginTop: 20,
                  textAlign: "left",
                }}
              >
                {`${pickupScheduledDate}  `}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.ddatetitle}>Drop Off Date </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#1A315C",
                  marginTop: 20,
                  textAlign: "left",
                }}
              >
                {`${dropoffScheduledDate}  `}
              </Text>
            </View>
          </View>
        )}

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
            onPress={() => {
                updateOrderRequest()
            }}
          >
            {indicator === true ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update</Text>
            )}
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
  locationImage: {
    height: SCREEN_HEIGHT * 0.045,
    width: 20,
    resizeMode: "contain",
  },

  card: {
    width: 386,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
    marginTop: 20,
    overflow: "hidden",
    position: "relative",
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
  blueCard: {
    backgroundColor: "#F2F5FF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
  datetitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#127AC5",
    textAlign: "left",
    marginTop: 20,
  },
  title3: {
    color: "#127AC5",
    fontSize: 18,
    width: 160,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
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
  ddatetitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#E32F8B",
    textAlign: "left",
    marginTop: 20,
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
    color: "black",
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
  editImage: {
    height: 20,
    width: 20,
    position: "absolute",
    right: 14,
    top: 12,
    opacity: 0.5,
  },
});
