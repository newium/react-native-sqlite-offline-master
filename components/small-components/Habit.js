import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

class Habit extends Component {
  constructor() {
    super();
    this.state = {
      backgroundColor: "gray"
    };
  }

  render() {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("ProductDetails", {
              prodId: `${this.props.prodId}`
            });
          }}
          style={styles.whattheflex}
        >
          <View>
            <Icon name="invert-colors" size={46} color="#46499a" />
          </View>
          <View style={{ margin: 10, textAlign: "left" }}>
            <Text style={{ fontSize: 28 }}>
              {this.props.name}
              <Text>{this.state.backgroundColor}</Text>
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            let letter = "#000";
            if (
              this.state.backgroundColor === "gray" ||
              this.state.backgroundColor === "red"
            )
              {
                letter = "green";
              }
            else if (this.state.backgroundColor === "green") 
            {
              letter = "blue";
            }
            else 
            {
              letter = "red";
            }
            this.setState({ backgroundColor: letter });
          }}
        >
          <View>
            <Icon
              name="location-city"
              size={36}
              color={this.state.backgroundColor}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    marginBottom: 5,
    padding: 3,
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

export default withNavigation(Habit);
