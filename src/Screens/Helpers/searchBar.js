
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,

} from "react-native";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;


export default function SearchBar({ value, updateSearch, style }) {

    //state declaration
    const [query, setQuery] = useState()
    const [error, setError] = useState(false)


    return (
        <View style={[styles.container, style]}>
            <View style={styles.searchContainer}>
                <View style={styles.vwSearch}>
                    <Image
                        style={styles.icSearch}
                        source={require('../../assets/search3.png')} />
                </View>
                <TextInput
                    value={query}
                    style={styles.textInput}
                    placeholder="Search"
                    onChangeText={(text) => {
                        let letters = /^$|^[a-zA-Z._\b ]+$/;
                        if (text.length > 12) {
                            setError('Query too long')
                        }
                        else if (text.match(letters)) {
                            setQuery(text)
                            updateSearch(text)
                            if (error)
                                setError(false)
                            
                        }
                        else setError("Please enter only alpahabets")
                        
                    }}
                />
                {
                    query ?
                        <TouchableOpacity
                            onPress={() => setQuery('')}
                            style={styles.vwClear}
                        >
                            <Image
                                style={styles.icClear}
                                source={require('../../assets/Images/clear.png')} />

                        </TouchableOpacity>
                        : <View style={styles.vwClear} />
                }
            </View>
            {
                error && 
                <Text style={styles.txtError}>
                    {error}
                </Text>
            }
        </View>
            

    );

}

const styles = StyleSheet.create({
    txtError: {
        marginTop: '2%',
        width: '89%',
        color: 'red',
       textAlign:'center'
    },
    vwClear: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        //backgroundColor: 'grey'
    },
    vwSearch: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        //width: 40,
        // backgroundColor: 'red'

    },
    icSearch: {
        height: 18,
        width: 18
    }
    ,
    searchContainer: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.07,
        borderRadius: 50,
        flexDirection: 'row'
    },

    container: {
        height: 80,
        alignItems:'center'
    }
})