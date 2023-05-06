import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function RoundedButton({value, style, style1, style2, style3}) {
    const buttons = [{

    }]
    const [counter, setCounter] = React.useState(0);
    const buttonClickedHandler = () => {
        console.log('You have been clicked a button!');
        // do something
    };

    return (
        <View style={styles.screen}>
            <View
                style={[styles.roundButton2, style]}>
            </View>

            <TouchableOpacity
                onPress={buttonClickedHandler}
                style={[styles.roundButton2, style1]}>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={buttonClickedHandler}
                style={[styles.roundButton2, style2]}>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={buttonClickedHandler}
                style={[styles.roundButton2, style3]}>
            </TouchableOpacity>
        </View>
    );
}

export default RoundedButton;

/// Just some styles
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection:'row',
        justifyContent:'flex-end' ,
        alignItems: 'center',
    },
    roundButton1: {
        width: 2,
        height: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginRight:6,
        borderRadius: 100,
        backgroundColor: '#E68D41',
    },
    roundButton2: {
        width: 2,
        height: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginRight: 6,
        borderRadius: 100,
        backgroundColor: '#ccc',
    },
});