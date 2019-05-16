import React, { Component } from 'react';

import {
    StyleSheet,

    View,
    Text,
    TouchableOpacity,
    Image
  } from "react-native";

  import Icon from "react-native-vector-icons/MaterialIcons";




export default class ProductScreen extends Component {
    
    
    constructor() {
        super();
        this.state = {
            backgroundColor: "#777"
        };
      }
    
    
    
    
    
    
    
    
    
    render() {
    return (
        <View style={styles.listItem}>
        <TouchableOpacity
          onPress={this.props.handlePress}
          style={styles.whattheflex}
        >
        <View >
          <Icon name="color-lens" size={46} color="#46499a" />
  </View>
          <View style={{margin:10,textAlign:"left"}}>
            <Text style={{fontSize:28}}>{this.props.name}<Text>: ZADATAK</Text></Text>
            
          </View>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={this.daySwap}>
          <View>
            <Icon
              name="brightness-4"
              size={36}
              color={this.state.backgroundColor}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


daySwap = () => {
    let letter = "#000";
    if (
      this.state.backgroundColor === "#777" ||
      this.state.backgroundColor === "#f00"
    )
      letter = "#0f0";
    else if (this.state.backgroundColor === "#0f0") letter = "#00f";
    else letter = "#f00";
    this.setState({ backgroundColor: letter });
  };


const styles = StyleSheet.create({
 
    listItem: {
      width: "100%",
      marginBottom: 5,
      padding: 10,
      backgroundColor: "#f2f2f2",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    
    whattheflex: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start"
    }
  });