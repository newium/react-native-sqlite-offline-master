import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation
} from "react-native-popup-dialog";
import Database from "../../Database2";
import Icon from "react-native-vector-icons/MaterialIcons";
const db = new Database();

export default class IconSelect extends Component {
  static navigationOptions = {
    title: "Pick an icon"
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      icons: []
    };
    this.getIcons();
  }

  getIcons() {
    let icons = [];

    db.listIcons()
      .then(result => {
        icons = result;

        this.setState({
          icons: icons,
          isLoading: false
        });
        db.closeDatabase();
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <FlatGrid
        itemDimension={40}
        items={this.state.icons}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        // spacing={20}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              item.iconBought
                ? this.props.iconHandler(item.iconName, 0)
                : this.props.iconHandler(item.iconName, item.iconPrice)
            }>
            <View style={[styles.itemContainer, { backgroundColor: "#ddd" }]}>
              <Icon
                name={item.iconName}
                size={item.iconBought ? 30 : 25}
                color={item.iconBought ? "#555" : "#eee"}
              />

              <Text
                style={item.iconBought ? { display: "none" } : styles.itemCode}>
                {item.iconBought ? "" : item.iconPrice}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 20,
    flex: 1,
    minHeight: 185
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 5,
    height: 50,
    width: "100%"
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600"
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff"
  }
});
