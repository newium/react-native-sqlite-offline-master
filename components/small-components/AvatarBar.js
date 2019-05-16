import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";




//const line=require('../../assets/images/01.jpg')
const line=require('../../assets/images/pikachu-gif-png-3.gif')
const AvatarBar = props => (


    
  <TouchableOpacity style={styles.avatarBar}>
  
    <View style={styles.avatar}>
    <Image style={{height:"100%",width:"100%",resizeMode:"center"}} source= {line} />
    </View>
    <View style={styles.info}>
        <View style={styles.stars}>
        <Text>stars </Text>
        </View>
        <View style={styles.time}>
        <Text>time </Text>
        </View>
        <View style={styles.health}>
        <Text>health </Text>
        </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  avatarBar: {
    width: "100%",
    height:148,
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "stretch",
  },
  avatar: {
    width: "50%",
    backgroundColor: "#f0f9e0",
   
  },
  info: {
    flexDirection: "column",
    alignItems: "stretch",
    flexGrow:1,
    
  },
  stars:{
    backgroundColor: "#54e",
    flexDirection: "row",
    flexGrow:1,
  },
  time:{
    backgroundColor: "#40b",
    flexDirection: "row",
    flexGrow:1,
},
health:{
    backgroundColor: "#b24",
    flexDirection: "row",
    flexGrow:1,
},
});

export default AvatarBar;