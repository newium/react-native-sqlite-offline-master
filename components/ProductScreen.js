import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { ListItem, Button } from "react-native-elements";
import Database from "../Database2";
import Icon from "react-native-vector-icons/MaterialIcons";
import AvatarBar from "./small-components/AvatarBar";
import Habit from "./small-components/Habit";

const db = new Database();

export default class ProductScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Ready to seize the day?",
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: "transparent" }}
          icon={{
            name: "add-circle",
            style: { marginRight: 60, fontSize: 36 }
          }}
          onPress={() => {
            navigation.navigate("AddHabit", {
              onNavigateBack: this.handleOnNavigateBack
            });
          }}
        />
      ),
      headerLeft: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: "transparent" }}
          icon={{
            name: "headset",
            style: { marginRight: 60, fontSize: 36 }
          }}
          onPress={() => {
            navigation.navigate("AddHabit", {
              onNavigateBack: this.handleOnNavigateBack
            });
          }}
        />
      )
    };
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      products: [],
      notFound:
        "You have no habits yet :(\nPlease click (+) button to add some",
      iconColor: "gray"
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener("didFocus", () => {
      this.getProducts();
    });
  }

  getProducts() {
    let products = [];
    db.listProduct()
      .then(data => {
        products = data;
        this.setState({
          products,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false
        };
      });
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
   
<Habit name= {item.prodName}
prodId={item.prodId}></Habit>



  );

  // style={[styles.placeImage, {backgroundColor: this.state.backgroundColor}] }  >

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0930ff" />
        </View>
      );
    }
    if (this.state.products.length === 0) {
      return (
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>
        </View>
      );
    }
    return (
      <View>  
        <AvatarBar />
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.products}
          renderItem={this.renderItem}
        />
        
         
      </View>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  message: {
    padding: 16,
    fontSize: 18,
    color: "red"
  },
  listItem: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  placeImage: {
    marginRight: 10,
    height: 30,
    width: 30
  },
  whattheflex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  }
});
