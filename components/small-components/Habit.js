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
            this.props.navigation.navigate("Habit Details\n`${this.props.habitName}`", {
              habitId: `${this.props.habitId}`
            });
          }}
          style={styles.whattheflex}
        >
          <View>
            <Icon name={this.props.icon} size={36} color="#111" />
          </View>
          <View style={{ margin: 5, flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between" }}>
           <View> <Text style={{ fontSize: 24 }}>
              {this.props.name}</Text></View>
              <View> <Text>{this.state.dayTask}</Text></View>
            
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
