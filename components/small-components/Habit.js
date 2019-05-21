import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import Database from "../../Database2";
import Icon from "react-native-vector-icons/MaterialIcons";





const db = new Database();

class Habit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "gray",
      emotion: "neutral",
      dayTask: ""
    };
    this.getDailyTask();
  }

  getDailyTask() {
   /*  console.log("COWABUNGA");
    console.table(this.props); */
    db.getDayForHabit(this.props.now, this.props.habitId)
      .then(data => {
        this.setState({
          dayTask: data.task
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handlePress = () => {
    if (
      this.state.backgroundColor === "gray" ||
      this.state.backgroundColor === "red"
    ) {
      this.state = {
        backgroundColor: "green",
        emotion: "great"
      };
    } else if (this.state.backgroundColor === "green") {
      this.state = {
        backgroundColor: "blue",
        emotion: "neutral"
      };
    } else {
      this.state = {
        backgroundColor: "red",
        emotion: "bad"
      };
    }

    this.updateDay();
    this.props.handleHabit(this.state.emotion);
  };

  updateDay = () => {
    db.updateDayStatus(
      this.state.emotion,
      this.props.now,
      this.props.habit.habitId
    )
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    if (this.state.emotion === "great") {
      return;
    }

    if (this.state.emotion === "neutral") {
      let task = this.state.dayTask;
      let counter = this.props.habit.currentDayUntilReward;
      let tempDate = this.props.now.valueOf();
      for (let i = 0; i < 49; i++) {
        tempDate += 24 * 60 * 60 * 1000;
        db.updateDayTask(task, tempDate, this.props.habit.habitId)
          .then(result => {
            //console.log(result);
          })
          .catch(err => {
            console.log(err);
          });

        if (counter === 0) {
          task += Number(this.props.habit.rateValue);
          counter = Number(this.props.habit.rateDays);
        }
        counter--;
      }
    }

    if (this.state.emotion === "bad") {
      let task = this.state.dayTask - Number(this.props.habit.rateValue);
      let counter = this.props.habit.currentDayUntilReward;
      let tempDate = this.props.now.valueOf();
      for (let i = 0; i < 49; i++) {
        tempDate += 24 * 60 * 60 * 1000;
        db.updateDayTask(task, tempDate, this.props.habit.habitId)
          .then(result => {
            //console.log(result);
          })
          .catch(err => {
            console.log(err);
          });

        if (counter === 0) {
          task += Number(this.props.habit.rateValue);
          counter = Number(this.props.habit.rateDays);
        }
        counter--;
      }
    }
  };

  render() {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("HabitDetails", {
              habitId: `${this.props.habit.habitId}`
            });
          }}
          style={styles.whattheflex}
        >
          <View>
            <Icon name={this.props.habit.icon} size={36} color="#111" />
          </View>
          <View
            style={{
              margin: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <View>
              <Text style={{ fontSize: 24 }}>{this.props.habit.habitName}</Text>
            </View>
            <View>
              
              <Text>{this.state.dayTask}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.handlePress}>
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
