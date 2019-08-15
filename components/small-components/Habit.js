import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import Database from "../../Database2";
//import Icon from "react-native-vector-icons/MaterialIcons";
import { Icon } from "react-native-elements";

const db = new Database();

class Habit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iconColor: "gray",
      emotion: "neutral",
      icon: "help-outline",
      dayTask: "",
      day:{},
    };
    this.getDailyTask();
  }

  getDailyTask() {
    db.getDayForHabit(this.props.now, this.props.habit.habitId)
      .then(data => {
        this.setState({
          dayTask: data.task,
          day:data,
          
        });
        if(data.status)
        this.setState({
         emotion:data.status
          
        });
        if(data.status=='great')
        this.setState({
         iconColor: 'green'
          
        });
        if(data.status=='bad')
        this.setState({
         iconColor: 'red'
          
        });
        if(data.status=='neutral')
        this.setState({
         iconColor: 'blue'
          
        });
        console.log(this.state.iconColor);
        if (this.state.iconColor === "red") {
          this.setState({
            iconColor: "red",
            emotion: "bad",
            icon: "clear"
          });
        } else if (this.state.iconColor === "blue") {
          this.setState({
            iconColor: "blue",
            emotion: "neutral",
            icon: "replay"
          });
        } else if (this.state.iconColor === "green") {
          this.setState({
            iconColor: "green",
            emotion: "great",
            icon: "done"
          });
          console.log(this.state.icon);
          this.props.handleHabit('emoti');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handlePress = () => {
    console.log(this.state.iconColor);
    if (this.state.iconColor === "blue") {
      this.setState({
        iconColor: "red",
        emotion: "bad",
        icon: "clear"
      }, () =>{this.updateDay(this.state.emotion)});
    } else if (this.state.iconColor === "green") {
      this.setState({
        iconColor: "blue",
        emotion: "neutral",
        icon: "replay"
      }, () =>{this.updateDay(this.state.emotion)});
    } else {
      this.setState({
        iconColor: "green",
        emotion: "great",
        icon: "done"
      },  () =>{ 
        this.updateDay(this.state.emotion)});
    }
   
   // this.updateDay(this.state.emotion);
    
  };

  updateDay = (emotion) => {
   
    this.props.handleHabit(this.state.emotion);

    db.updateDayStatus(emotion, this.props.now, this.props.habit.habitId)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    if (emotion === "great") {
      let task;
      if (this.props.habit.currentDayUntilReward === 1) {
        task =
          Number(this.state.dayTask) + Number(this.props.habit.rateValue);
      } else {
        task = Number(this.state.dayTask);
      }
      let counter = this.props.habit.currentDayUntilReward-1;
      let tempDate = this.props.now.valueOf();
      let month = new Date(tempDate).getMonth();
      let m=month;
      while (
        month === m ||
        month === (m + 1) % 12
      ) {
        tempDate += 24 * 60 * 60 * 1000;
        db.updateDayTask(task, tempDate, this.props.habit.habitId)
          .then(result => {
            //console.log(result);
          })
          .catch(err => {
            console.log(err);
          });

        month = new Date(tempDate).getMonth();
        counter--;
        if (counter === 0) {
          task += Number(this.props.habit.rateValue);
          counter = Number(this.props.habit.rateDays);
        }
      }
    }

    if (emotion === "neutral") {
      let task = Number(this.state.dayTask);
      let counter = Number(this.props.habit.rateDays);
      let tempDate = this.props.now.valueOf(); //in milis
      let month = new Date(tempDate).getMonth();
      let m=month;
      while (
        month === m ||
        month === (m + 1) % 12
      ) {
        tempDate += 24 * 60 * 60 * 1000;
        db.updateDayTask(task, tempDate, this.props.habit.habitId)
          .then(result => {
            //console.log(result);
          })
          .catch(err => {
            console.log(err);
          });

        month = new Date(tempDate).getMonth();
        counter--;
        if (counter === 0) {
          task += Number(this.props.habit.rateValue);
          counter = Number(this.props.habit.rateDays);
        }
      }
    }

    if (emotion === "bad") {
      let task =
        Number(this.state.dayTask) - Number(this.props.habit.rateValue);
      let counter = this.props.habit.rateDays;
      let tempDate = this.props.now.valueOf();
      let month = new Date(tempDate).getMonth();
      let m=month;
      while (
        month === m ||
        month === (m + 1) % 12
      ) {
        tempDate += 24 * 60 * 60 * 1000;
        db.updateDayTask(task, tempDate, this.props.habit.habitId)
          .then(result => {
            //console.log(result);
          })
          .catch(err => {
            console.log(err);
          });

        month = new Date(tempDate).getMonth();
        counter--;
        if (counter === 0) {
          task += Number(this.props.habit.rateValue);
          counter = Number(this.props.habit.rateDays);
        }
      }
    }

  };

  render() {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("HabitDetails", {
              habitId: `${this.props.habit.habitId}`,
              
            });
          }}
          style={styles.whattheflex}>
          <View>
            <Icon name={this.props.habit.icon} size={46} color="#46499a" />
          </View>
          <View style={{ margin: 10, textAlign: "left" }}>
            <Text style={{ fontSize: 28 }}>{this.props.habit.habitName}</Text>
            <Text style={{ fontSize: 18 }}>{this.state.dayTask} {this.props.habit.unit}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.handlePress}>
          <View>
            <Icon
              name={this.state.icon}
              size={36}
              color={this.state.iconColor}
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
    justifyContent: "space-between",
    paddingLeft:15,
    paddingRight:15,
  },

  whattheflex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  }
});

export default withNavigation(Habit);
