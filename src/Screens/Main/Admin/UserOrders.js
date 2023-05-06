import React, { useState, useContext, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const AdminUserOrders = ({ navigation, route }) => {
    const [data, setData] = useState({})
    const [keys, setKeys] = useState([])

    useEffect(() => {
        if (route.params !== undefined) {
            setData(route.params.hasOwnProperty("data") ? route.params.data : "");
            setKeys(Object.keys(data))
        }
    }, [data])

    return (
        <ScrollView style={{ backgroundColor: "#1A315C", position: "relative" }} showsVerticalScrollIndicator={false}>
            <View
                style={{
                    backgroundColor: "#FCD07F",
                    height: SCREEN_HEIGHT,
                    width: SCREEN_WIDTH,
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: SCREEN_WIDTH,
                        backgroundColor: "#FffffF",
                        marginBottom: 20,
                        marginLeft: 0,
                        shadowOpacity: 0.3,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 30,
                        borderBottomColor: "#203866",
                        borderBottomWidth: 4,
                        paddingBottom: 10
                    }}
                >
                    <Text
                        style={{
                            color: "#203866",
                            fontSize: 22,
                            padding: 2,
                            margin: 2,
                        }}
                    >
                        {data.Order}
                    </Text>
                    <Text
                        style={{
                            color: "#203866",
                            fontSize: 16,
                            padding: 2,
                            margin: 2,
                        }}
                    >
                        {data.timeCreated && helpers.dateMonthYearTimeFormat(data.timeCreated.seconds, data.timeCreated.nanoseconds)}
                    </Text>
                </View>
                {keys.map((item, id) => {
                    return (
                        <View key={id} style={{ flexDirection: 'row', width: SCREEN_WIDTH * 0.8, marginVertical: 8 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#1A315C", }}>
                                {item} :
                            </Text>
                            <Text style={{
                                fontSize: 16, marginLeft: 10, color: "#1A315C",
                            }}>
                                {data[item].toString()}
                            </Text>
                        </View>
                    )
                })
                }
            </View>

        </ScrollView>
    );
};

export default AdminUserOrders;

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 5,
        paddingTop: 8,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: "#2F4D86",
        borderRadius: 4,
        backgroundColor: "#FCD07F",
        color: "black",
        width: "100%",
    },
    inputANDROID: {
        fontSize: 16,
        paddingVertical: 5,
        paddingTop: 8,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: "#2F4D86",
        borderRadius: 4,
        backgroundColor: "#FCD07F",
        color: "black",
        width: "100%",
    },
});