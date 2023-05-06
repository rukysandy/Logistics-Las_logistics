import { StatusBar } from "expo-status-bar";
import React, {useState} from "react";
import RoundedButton from '../RoundedButton'
import SearchBar from "../../Helpers/searchBar";

import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    ScrollView,

} from "react-native";


const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;


export default function AdminOrders({ navigation }) {
    const [value, setValue] = useState('')
    let updateSearch = (value) => {
        //do your search logic or anything
        console.log(value)
    };

    const data = {
        Order: 'Enugu', Date: '20-01-2018', Phonenumber: '08055756165',
        Address: 'Ikota Estate, Lekki', City: 'Lasgidi'
    }
    const cardItem = [
        {
            title: "Lagos",
        },
        {
            title: "Ibadan",
        },
        {
            title: "Enugu",
        },
        {
            title: "Lekki",
        },

    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ height: 50 }} />
                <View
                    style={styles.cardcontainer}>
                    <SearchBar
                        value={value}
                        updateSearch={updateSearch}
                        style={{ marginTop: '8%' }}
                    />
                    {cardItem && cardItem.map((item, id) => {
                        return (
                            <TouchableOpacity
                                key={id}
                                onPress={() => {
                                    navigation.navigate("UserOrders", {data: data})
                                }}
                                style={styles.card}
                            >
                                {/* <View style={[styles.minicard, { backgroundColor: item.bgcol }]}><Text style={styles.whitetext}>BJ</Text></View> */}
                                <Text style={styles.title}>
                                    {item.title}
                                </Text>
                            </TouchableOpacity>

                        );
                    })}
                    
                </View>



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
        padding: 21,
        backgroundColor: "#F2F5FF",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    cardcontainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        fontFamily: "Montserrat-Bold",
        fontSize: 25,
        color: "#7B84AC",
    },
    card: {

        backgroundColor: "#ffffff",
        height: 80,
        width: SCREEN_WIDTH * 0.9,
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
        fontSize: 14,
        width: 160,
        alignSelf: "flex-start",
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
        marginBottom: 10
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
