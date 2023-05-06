import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
export default function OrderSuccessful({ navigation }) {
    

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                <View style={styles.container}>
                    <View style={styles.textView}>
                        <Image
                            style={styles.locationImage}
                            resizeMode="contain"
                            source={require("../../../../assets/Images/Group/Group3.png")}
                        />
                    </View>
                    <Text style={styles.headerText}>Order Successful</Text> 
                    <Text style={styles.normaltext}> Your Order have sent you will receive a response from our agents soon</Text>

                    <TouchableOpacity style={styles.closeButton}
                        onPress={async () => {
                            navigation.navigate('HomeScreen')
                        }}
                    // onPress={() => { submitOrder(orderParameters) }}
                    >
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>

                </View>



            </ScrollView>

            {/* <View style={styles.card}>
          <View style={styles.imageView}>
            <Image
              style={styles.userImage}
              source={require("../../../assets/Images/shipper3.png")}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}> As a User</Text>
            <Text style={styles.text}>I want to Send A Package</Text>
          </View>
        </View> */}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 21,
        backgroundColor: "#F2F5FF",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT ,
    },
    cardcontainer: {
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        fontFamily: "Montserrat-Bold",
        fontWeight: 'bold',  
        fontSize: 36,
        color: "#127AC5",
    },
    card: {

        backgroundColor: "#ffffff",
        height: 230,
        width: 185,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
        padding: 15
        // marginHorizontal: 12,
        // margingRight: 10

    },
    whitetext: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: "bold"

    },
    minicard: {
        backgroundColor: "#ffffff",
        height: 80,
        width: 85,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        marginBottom: 10,
        padding: 15
    },
    userImage: {
        height: SCREEN_HEIGHT * 0.25,
        width: 150,
        resizeMode: "contain",
    },
    imageView: {
        height: SCREEN_HEIGHT * 0.23,
        width: 200,
        // backgroundColor: "yellow",
        overflow: "hidden",
    },
    title: {
        color: "#33395C",
        fontSize: 18,
        width: 160,
        fontWeight: 'bold',
        alignSelf: "flex-start",
        paddingTop: 7,
        // color: "#E32F8B",
    },
    normaltext: {
        color: "#7B84AC",
        fontSize: 16,
        textAlign: 'center',
        width:273,
        paddingTop: 7,
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

    accountCheck: {
        margin: 10,
        padding: 10,
    },
    firstText: {
        fontSize: 18,
        textAlign: "left",
        fontFamily: "Montserrat-Regular",
        color: "#33395C",
        marginBottom: 20
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
    locationImage: {
        height: SCREEN_HEIGHT * 0.25,
        width: 318,
        resizeMode: "contain",

    },
    closeButton: {
        backgroundColor: "#E68D41",
        borderRadius: 15,
        padding: 20,
        marginTop: 60,
        width: 386,
        alignItems: "center",
        justifyContent: "center",
    },
});
