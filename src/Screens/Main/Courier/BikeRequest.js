import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    TextInput,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { dateMonthYearTimeFormat } from "../../Helpers/timehelpers";
import firebase from "firebase";
let ORDER_PARAMS = {
    email: "",
    idToken: "",
    carrierType: "",
    pickupLocation: "",
    destination: "",
    pickupNumber: "",
    dropoffNumber: "",
    dropoffEmail: "",
    selectedCourier: "Aji",
    orderContent: "document",
    UID: "",
};


const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function BikeRequest({ navigation }) {
    const [rideOrders, setRideOrders] = useState([])
    const [orderParameters, setOrderParameters] = useState(ORDER_PARAMS)
    //const navigation = useNavigation()
    const getBikeOrders = async () => {
        const events = await firebase.firestore().collection('Orders').where("carrierType", "==", "RIDE")
        events.get().then((querySnapshot) => {
            const tempDoc = []
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
            })
            setRideOrders(tempDoc)
            console.log(tempDoc)
        })
    }

    useEffect(() => {
        getBikeOrders()
    }, []);
    return (
        <View style={styles.modalCard}>
            {Array.isArray(rideOrders) && (rideOrders.length > 0) && rideOrders.map((item, i) => {
                return (
                    <TouchableOpacity
                        key={i}
                        onPress={() => {
                            navigation.navigate("MyRequestDetails", {
                                orderParameters: item,
                            });
                        }}
                        style={styles.requestCard}
                    >
                        <View style={styles.requestCard}>

                            <View style={styles.bluecard}>
                                <View style={styles.textView}>
                                    <Image
                                        style={styles.locationImage}
                                        resizeMode="contain"
                                        source={require("../../../assets/Images/LOCATIONFROM/FROM2.png")}
                                    />
                                </View>

                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>From</Text>
                                    <Text style={styles.inputText}>{item.pickupLocation}</Text>
                                </View>
                            </View>

                            <View style={styles.pinkcard}>
                                <View style={styles.textView}>
                                    <Image
                                        style={styles.locationImage}
                                        resizeMode="contain"
                                        source={require("../../../assets/Images/LOCATIONFROM/HOMEICON2.png")}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.pinktitle}>To:</Text>
                                    <Text style={styles.inputText}>{item?.destination}</Text>
                                </View>
                            </View>

                            <View style={styles.dateDetails}>
                                <Text style={styles.dateText}>
                                     {dateMonthYearTimeFormat(item.timeCreated.seconds, item.timeCreated.nanoseconds)}
                                </Text>
                                <Text style={styles.newText}>{item?.orderStatus}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: "Montserrat-Bold",
        fontSize: 22,
        color: "#7B84AC",
    },
    bannerView: {
        // position: "absolute",
        height: SCREEN_HEIGHT * 0.21,
        width: SCREEN_WIDTH * 0.95,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,

        alignItems: "center",
        marginTop: 35,
    },
    bannerImage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: SCREEN_WIDTH * 0.9,
        alignSelf: "center",
    },
    bannerTextView: {
        width: "39%",
    },
    tileCatView: {
        width: SCREEN_WIDTH * 0.95,
        paddingHorizontal: 22,
        alignItems: "flex-start",
        marginTop: 30,
    },
    title: {
        fontFamily: "Montserrat-Bold",
        fontSize: 20,
        // color: "#E32F8B",
    },
    bannerText: {
        fontFamily: "Montserrat-Bold",
        fontSize: 15,
        color: "#FFFFFF",
        right: 90,
        top: 115,
    },

    submitButton: {
        height: SCREEN_HEIGHT * 0.065,
        width: SCREEN_WIDTH * 0.35,
        backgroundColor: "#E68D41",
        borderRadius: 15,
        padding: 10,
        margin: 15,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
    },
    buttonText: {
        color: "#FFFFFF",
        fontFamily: "Montserrat-Bold",
        fontSize: 18,
    },
    categoriesCard: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
        borderWidth: 0.5,
        height: SCREEN_WIDTH * 0.41,
        width: SCREEN_WIDTH * 0.41,
        borderRadius: 14,
        justifyContent: "space-around",
        alignItems: "center",
        margin: 15,
        padding: 4,
    },
    categoriesView: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
    },
    categoryImage: {
        height: "75%",
        width: "75%",
        resizeMode: "contain",
    },
    categoryText: {
        color: "#127AC5",
        fontFamily: "Montserrat-Bold",
        fontSize: 18,
    },
    categoryTitle: {
        color: "#FFFFFF",
        fontFamily: "Montserrat-Bold",
        fontSize: 18,
    },
    titleView: { width: SCREEN_WIDTH, justifyContent: "center" },
    modalCard: {
        width: "100%",
        minHeight: 150,
        backgroundColor: "#F2F5FF",
        borderRadius: 22,
        alignItems: "center",
        paddingTop: 20,
        overflow: "hidden",

    },
    orderText: {
        color: "#7B84AC",
        fontFamily: "Montserrat-Bold",
        fontSize: 22,
    },
    card: {
        //height: SCREEN_HEIGHT * 0.5,
        paddingVertical: 20,
        width: "90%",
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
        overflow: "hidden",
        marginBottom: 30,
    },
    requestCard: {
        paddingVertical: 4,
        width: "90%",
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
        overflow: "hidden",
        marginBottom: 30,
    },

    textContainer: {
        alignSelf: "flex-start",
    },
    bluecard: {
        //height: 50,
        paddingVertical: 8,
        width: SCREEN_WIDTH * 0.8,
        paddingHorizontal: 5,
        backgroundColor: "#F2F5FF",
        borderColor: "#127AC533",
        borderWidth: 1,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        paddingLeft: 0,
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
    // imageView: {
    //   height: SCREEN_HEIGHT * 0.23,
    //   width: 200,
    //   // backgroundColor: "yellow",
    //   overflow: "hidden",
    // },
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
        fontFamily: "Montserrat-Bold",
        fontSize: 16,
        paddingTop: 10,
        textAlign: "left",
        paddingLeft: 2,
        width: SCREEN_WIDTH * 0.67,
        color: "#7B84AC",
    },
    dateDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        //width: "78%",
        marginTop: 20,
        alignSelf:'flex-end'
    },
    pendingText: {
        color: "#E68D41",
        fontFamily: "Montserrat-Bold",
        fontSize: 14,
    },
    newText: {
        color: '#1dd626',
        fontFamily: "Montserrat-Bold",
        fontSize: 14,
    },
    dateText: {
        color: "#7B84AC",
        fontFamily: "Montserrat-Regular",
        fontSize: 11,
        
    },
    inputText: {
        color: "#3B3A3A",
        fontFamily: "Montserrat-Regular",
    },
});
