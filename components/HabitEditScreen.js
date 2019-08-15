import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import Database from "../Database2";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconSelect from "./small-components/IconSelect";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation
} from "react-native-popup-dialog";
const db = new Database();

export default class HabitEditScreen extends Component {
  static navigationOptions = {
    title: "Edit Habit"
  };

  constructor() {
    super();
    this.state = {
      habitId: "",
      habitName: "",
      icon: "",
      unit: "",
      startValue: "",
      rateValue: "",
      rateDays: "",
      startDate: new Date(),
      currentReward: 0,
      currentDayUntilReward: "",
      isLoading: true,
      showIconDialogue: false,
      showBuyIconDialogue: false,
      potentialIcon: "",
      price: 0,
      currentPoints: 0
    };
    db.getUser()
      .then(data => {
        user = data;
        this.setState({
          user:user,
          currentPoints:user.currentStars,
         
        });
       
      
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    const { navigation } = this.props;
    db.habitById(navigation.getParam("habitId"))
    .then(data => {
      
      habit = data;
      
      this.setState({
        habitName:habit.habitName,
        startValue:habit.startValue,
        rateValue:habit.rateValue.toString(),
        rateDays:habit.rateDays.toString(),
        unit:habit.unit,
        isLoading: false,
      icon:habit.icon,
        habitId: habit.habitId
      });
     
    })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false
        };
      });
  }

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  };

  updateProduct() {
    this.setState({
      isLoading: true
    });
    const { navigation } = this.props;
    let data = {
      habitName: this.state.habitName,
      icon: this.state.icon,
      unit: this.state.unit,
      
      rateValue: Number(this.state.rateValue),
      rateDays: Number(this.state.rateDays),
     
    };
    db.updateHabit(habit.habitId, data)
      .then(result => {
        console.log(result);
        this.setState({
          isLoading: false
        });
        this.props.navigation.state.params.onNavigateBack;
        this.props.navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isLoading: false
        });
      });
  }
  pointsReduce =(points) => {
    let newUser=this.state.user;
    newUser.currentStars-=points
    this.setState({
      user:newUser,
    },()=>{
      db.updateUserStars(newUser.currentStars).then(result => {})
      .catch(err => {
        console.log(err);
      });
    });
  }



  iconHandler = (iconName, price) => {
    if (price > 0) {
      this.setState({
        potentialIcon: iconName,
        showIconDialogue: false,
        price: price,
        showBuyIconDialogue: true
      });

      return;
    }

    this.setState({ icon: iconName });
    this.setState({ showIconDialogue: false });
    
  };

  buyIcon = iconName => {
    db.buyIcon(iconName)
      .then(result => {
        this.setState({
          icon: iconName
        });
        db.closeDatabase();
      })
      .catch(err => {});
      this.pointsReduce(this.state.price);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.twoPerRow}>
        <View style={[styles.subContainer,{}]}>
          <Text>Habit name:&nbsp;&nbsp;</Text>
          <TextInput
          style={{maxWidth:150,
            minWidth:150,
            borderBottomWidth: 2,
    borderBottomColor: "#CCCCCC",
          paddingTop:12,}}
            placeholder={"Name"}
            value={this.state.habitName}
            onChangeText={text => this.updateTextInput(text, "habitName")}
          />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showIconDialogue: true });
            }}>
            <View
              style={[
                styles.icon,
                { textAlign: "center", backgroundColor: "#40a9fe" }
              ]}>
              <Icon name={this.state.icon} size={30} />
            </View>
          </TouchableOpacity>
       </View>

        <Dialog
          onTouchOutside={() => {
            this.setState({ showIconDialogue: false });
          }}
          width={0.9}
          height={0.5}
          visible={this.state.showIconDialogue}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({ showIconDialogue: false });
            return true;
          }}
          dialogTitle={
            <DialogTitle title="Choose an icon" hasTitleBar={false} />
          }
          actions={[
            <DialogButton
              text="Select"
              onPress={() => {
                this.setState({ showIconDialogue: false });
              }}
              key="button-1"
            />
          ]}>
          <DialogContent>
            <IconSelect iconHandler={this.iconHandler}></IconSelect>
          </DialogContent>
        </Dialog>

        <Dialog
          onDismiss={() => {
            this.setState({ showBuyIconDialogue: false });
          }}
          width={0.9}
          visible={this.state.showBuyIconDialogue}
          rounded
          actionsBordered
          // actionContainerStyle={{
          //   height: 100,
          //   flexDirection: 'column',
          // }}
          dialogTitle={
            <DialogTitle
              title="Purchase Icon"
              style={{
                backgroundColor: "#F7F7F8"
              }}
              hasTitleBar={false}
              align="left"
            />
          }
          footer={
            this.state.currentPoints - this.state.price >= 0 ? (
              <DialogFooter>
                <DialogButton
                  text="BUY"
                  bordered
                  onPress={() => {
                    this.buyIcon(this.state.potentialIcon);
                    this.setState({
                      showIconDialogue: true,
                      currentPoints:
                        this.state.currentPoints - this.state.price,
                      showBuyIconDialogue: false
                    });
                  }}
                  key="button-2"
                />
                <DialogButton
                  text="CANCEL"
                  bordered
                  onPress={() => {
                    this.setState({
                      showIconDialogue: true,
                      showBuyIconDialogue: false
                    });
                  }}
                  key="button-1"
                />
              </DialogFooter>
            ) : (
              <DialogFooter>
                <DialogButton
                  text="CANCEL"
                  bordered
                  onPress={() => {
                    this.setState({ showBuyIconDialogue: false });
                  }}
                  key="button-1"
                />
              </DialogFooter>
            )
          }>
          <DialogContent
            style={{
              backgroundColor: "#F7F7F8"
            }}>
            {this.state.currentPoints - this.state.price >= 0 ? (
              <View>
                <Text>
                  Are you sure you want to buy this icon for {this.state.price}?
                </Text>
                <Icon name={this.state.potentialIcon} size={30} />
              </View>
            ) : (
              <Text>
                You can't buy that icon yet! You need{" "}
                {this.state.price - this.state.currentPoints} points more.
              </Text>
            )}
          </DialogContent>
        </Dialog>

        {/*  <View style={styles.subContainer}>
                         <TextInput
                           placeholder={"Icon name"}
                           value={this.state.icon}
                           
                           onChangeText={text =>
                             this.updateTextInput(text, "icon")
                           }
                         />
                       </View> */}
                       <View style={styles.twoPerRow}>
        <View style={styles.subContainer}>
        <Text>Custom unit:&nbsp;&nbsp;</Text>
          <TextInput
          style={{maxWidth:75,minWidth:75,
            borderBottomWidth: 2,
    borderBottomColor: "#CCCCCC",
          paddingTop:12,
          }}
            placeholder={"Unit"}
            value={this.state.unit}
            onChangeText={text => this.updateTextInput(text, "unit")}
          />
        </View>
        <View style={styles.subContainer}>
        <Text>Start value:&nbsp;&nbsp;{this.state.startValue}</Text>
          {/* <TextInput
           style={{maxWidth:75,minWidth:75,
            borderBottomWidth: 2,
    borderBottomColor: "#CCCCCC",
          paddingTop:12,
          }}
            placeholder={"Start"}
            value={this.state.startValue}
            keyboardType="numeric"
            onChangeText={text => this.updateTextInput(text, "startValue")}
          /> */}
        </View>

        </View>
        <View style={styles.twoPerRow}>
        <View style={styles.subContainer}>
        <Text style={{}}>Change habit by&nbsp;</Text>
          <TextInput  style={{maxWidth:60,minWidth:60,
            borderBottomWidth: 2,
    borderBottomColor: "#CCCCCC",
          paddingTop:12,
          }}
            placeholder={"rate"}
            value={this.state.rateValue}
            keyboardType="numeric"
            onChangeText={text => this.updateTextInput(text, "rateValue")}
          />
        </View>
        <View style={styles.subContainer}>
        <Text >on every &nbsp;</Text>
          <TextInput  style={{maxWidth:55,minWidth:55,
            borderBottomWidth: 2,
    borderBottomColor: "#CCCCCC",
          paddingTop:12,
          }}
            placeholder={"days"}
            value={this.state.rateDays}
            keyboardType="numeric"
            onChangeText={text => this.updateTextInput(text, "rateDays")}
          />
          <Text style={{}}>days</Text>
        </View>
</View>
        <View style={styles.button}>
          <Button
            large
            leftIcon={{ name: "save" }}
            title="Save"
            onPress={() => this.saveHabit()}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    
    flexDirection:'column',
    flexWrap:'nowrap',
    padding: 20,
    
  },
  twoPerRow:{
    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height:50,
    marginBottom: 20,
  },
  subContainer: {
    
    flexDirection: "row",
    
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 2,
    width:'46%',
    height:50,
   
    
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
  icon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,

    width: 50,
    height:50,
  },
  
});
