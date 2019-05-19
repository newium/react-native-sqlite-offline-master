import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Image,
  ButtonRN
} from "react-native";
import { ListItem, Button } from "react-native-elements";
import Database from "../Database2";
import Icon from "react-native-vector-icons/MaterialIcons";
import AvatarBar from "./small-components/AvatarBar";
import Habit from "./small-components/Habit";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import HabitUnfinished from "./small-components/HabitUnfinished";




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
     
    };
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      habits: [],
      lastAccess: '',
      user: {},
      unfinishedDays: [],
      unfinishedHabitsDialog: false,
      notFound:
        "You have no habits yet :(\nPlease click (+) button to add some",
      
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener("didFocus", () => {
      this.getHabits();
      this.getUser();
    });
    let today= new Date();
    this.updateUserAccess(today);
    let yesterday=today-(12*60*60*1000);
      getUnfinishedDays(yesterday);

      
    if(today.getHours<12)
    {
      
      if(this.state.unfinishedDays.length===0)
      {
        this._interval = setInterval(() => {
            let noon=new Date();
            noon.setHours=12;
            noon.setMinutes=0;
            if(today>=noon)
            {
              this.calculatePoints();
            }

              }, 120000); 
      }
      
      else
      {
        this.setState({
          unfinishedHabitsDialog:true,
        });
      
      }
    }
    else
    {

    }
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }


  calculatePoints(){



  }



  updateUserAccess(today) 
  {
    let data= now.toString();
    db.updateUserAccess(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    })
  }


  getUnfinishedDays(date) {
    let days = [];
    db.getUnfinishedDay(date.getDate(),date.getMonth(),date.getHour())
      .then(data => {
        days = data;
        this.setState({
          unfinishedDays=days,
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

  getHabits() {
    let habits = [];
    db.listHabits()
      .then(data => {
        habits = data;
        this.setState({
          habits
        });
      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false
        };
      });
  }

  getUser() {
    let habits = [];
    db.getUser()
      .then(data => {
        user = data;
        this.setState({
          user,
          lastAccess:new Date(user.lastAccess),
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

  renderRegular = ({ item }) => (
   
<Habit name= {item.habitName}
id={item.habitId}
icon={item.icon}
handleHabit={(emotion)=> {
  this.setState({
          avatarEmotion: emotion,
        });
}}
>
</Habit>
  );

  renderUnfinished=({item})=>
  {

    <HabitUnfinished
    name={this.state.habits.find(function(element) {
  return element.habitId = item.habitId;
    })[name] }
    icon={this.state.habits.find(function(element) {
  return element.habitId = item.habitId;
    })[icon] }
    
    >

    </HabitUnfinished>
  }

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

        <Dialog
          onDismiss={() => {
            this.setState({ unfinishedHabitsDialog: false });
          }}
          width={0.9}
          visible={this.state.unfinishedHabitsDialog}
          rounded
          actionsBordered
          // actionContainerStyle={{
          //   height: 100,
          //   flexDirection: 'column',
          // }}
          dialogTitle={
            <DialogTitle
              title="Popup Dialog - Default Animation"
              style={{
                backgroundColor: '#F7F7F8',
              }}
              hasTitleBar={false}
              align="left"
            />
          }
          footer={
            <DialogFooter>
              <DialogButton
                text="CANCEL"
                bordered
                onPress={() => {
                  this.setState({ unfinishedHabitsDialog: false });
                }}
                key="button-1"
              />
              <DialogButton
                text="OK"
                bordered
                onPress={() => {
                  this.setState({ unfinishedHabitsDialog: false });
                }}
                key="button-2"
              />
            </DialogFooter>
          }
        >
          <DialogContent
            style={{
              backgroundColor: '#F7F7F8',
            }}
          >
            <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.unfinishedDays}
          renderItem={this.renderUnfinished}
        />

          </DialogContent>
        </Dialog>

        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.habits}
          render={this.renderRegular}
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
