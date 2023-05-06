import React, { useRef, useState, useEffect } from "react";
import { View, Image, Platform, Text } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
// import Comments from "../shared/Chat/ChatGroupComments";
import { AntDesign } from "@expo/vector-icons";

export default function ChatCardSlideUpDown(props) {
  const renderHeader = () => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        height: 50,
        alignItems: "center",
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,

        // shadowColor: col?.("143426", -1),
        shadowColor: "#648B7A",
        shadowOffset: {
          width: 0,
          height: -12,
        },
        shadowOpacity: 0.1,
        shadowRadius: 14.0,

        elevation: 20,

        borderTopColor: "#648B7A",
        borderTopWidth: 0.2,

        borderRightWidth: 0.2,
        borderLeftWidth: 0.2,
        borderColor: "#648B7A",
      }}
    >
      <View style={{ bottom: 10 }}>
        <AntDesign name="minus" size={74} color={"#648B7A"} />
      </View>

      {/* <Image
        style={{
          width: 20,
          height: 15,
          tintColor: "#fff",
          alignSelf: "center",
        }}
        source={require("../images/icons/SlideUp.png")}
      /> */}

      <Text
        style={{
          color: "#648B7A",
          fontFamily: "Raleway-Medium",
          fontSize: 14,
          alignSelf: "flex-start",
          paddingHorizontal: 20,
          // paddingVertical: 15,
          marginBottom: 15,
          bottom: 10,
        }}
      >
        this is a a form
      </Text>
    </View>
  );
  const renderContent = () => (
    <View
      style={{
        backgroundColor: "white",
        paddingTop: 50,
        height: "100%",
      }}
    >
      <Text>this is a content</Text>
      <Text>this is a content</Text>
      <Text>this is a content</Text>
      <Text>this is a content</Text>
    </View>
  );

  const sheetRef = useRef(null);

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        enabledContentGestureInteraction={false}
        initialSnap={2}
        snapPoints={["90%", "70%", "40%"]}
        // borderRadius={10}
        renderContent={renderContent}
        renderHeader={renderHeader}
      />
    </>
  );
}
