import React, { useEffect, useState } from "react";
import RoundedButton from "../RoundedButton";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
export default function Payments({ route, navigation }) {
  const [orderParameters, setOrderParameters] = useState({});
  //const { state, checkNetworkConnection } = useContext(AuthContext);
  const [indicator, setIndicator] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({});
  const [payRef, setPayRef] = useState("");
  const [userID, setUserID] = useState("");
  const [viewWebView, setViewWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("");
  const [timeJoined, setTimeJoined] = useState("");
  const [showFundInput, setShowFundInput] = useState(false);
  const [fundAmount, setFundAmount] = useState(0.0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [listofBanks, setListOfBanks] = useState([]);
  const [namesOfbanks, setNamesOfBanks] = useState([]);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState();
  const [accountNumber, setAccountNumber] = useState();
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [PAYSTACKKEY, setPAYSTACKKEY] = useState("");
  const [PAYSTACK_SECRETKEY, setPAYSTACK_SECRETKEY] = useState("");
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [isEnabled, setIsEnabled] = useState(false);

  const paymentMethod = [
    {
      name: "Card",
      image: require("../../../../assets/Images/visa/g41582.png"),
      image2: require("../../../../assets/Images/mc/mc3.png"),
    },
    {
      name: "Paypal",
      image: "",
      image2: require("../../../../assets/Images/paypal/paypal3.png"),
    },
    {
      name: "Bank Transfer",
      image: "",
      image2: require("../../../../assets/Images/bank/bank3.png"),
    },
  ];
  useEffect(() => {
    if (route?.params?.orderParameters) {
      setOrderParameters(route?.params?.orderParameters);
    }
    console.log("final order details are... ", orderParameters);
  });
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.firstText}>Payments</Text>
          <RoundedButton />
        </View>
        <View style={styles.bluetopcard}>
          <Text style={styles.topnormaltext}>Order Price</Text>
          <Text style={styles.boldtext}>N1,000</Text>
        </View>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text style={styles.text}>Payment Method</Text>
          </View>
          <View style={styles.card}>
            {paymentMethod.map((item, id) => {
              return (
                <TouchableOpacity key={id}>
                  <View style={styles.paymentcard}>
                    <View style={styles.textView}>
                      <Text style={styles.title2}>{item.name}</Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <View style={styles.imageView}>
                        <Image
                          style={styles.userImage}
                          source={item.image}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.imageView}>
                        <Image
                          style={styles.userImage}
                          source={item.image2}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.navigate("OrderSuccessful")}
          >
            <Text style={styles.buttonText}>Next</Text>
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
    paddingTop: 25,
    backgroundColor: "#F2F5FF",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  card: {
    height: SCREEN_HEIGHT * 0.4,
    width: 386,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
    marginTop: 20,
    overflow: "hidden",
  },

  bluetopcard: {
    height: SCREEN_HEIGHT * 0.19,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: "#1D7CC2",
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    overflow: "hidden",
    alignSelf: "center",
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

  paymentcard: {
    height: 70,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#F2F5FF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    paddingLeft: 10,
  },

  userImage: {
    height: SCREEN_HEIGHT * 0.23,
    width: 30,
    resizeMode: "contain",
  },

  imageView: {
    height: SCREEN_HEIGHT * 0.23,
    width: 50,
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

    width: SCREEN_WIDTH * 0.77,
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
    alignSelf: "center",
    // marginTop: SCREEN_HEIGHT >= 800 ? SCREEN_HEIGHT * 0.2 : 0,
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
