import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  View,
  Text
} from "react-native";
import { Card, Button } from "react-native-elements";
import Database from "../Database2";
import { Calendar } from "react-native-calendars";
import CalendarDayComponent from "./CalendarDayComponent";
import { withNavigation } from "react-navigation";

import AreaChart from './charts/area/Graph';
import Pie from './charts/Pie';

const db = new Database();

class HabitDetailsScreen extends Component {
  static navigationOptions = {
    title: "Habit Details"
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      markedDays: {},
      id: "",
      habit: {},
      today: "",
      now: new Date(),
      colors: [
        "#2ca02c", "#1781cf", "#d62728", "#17cfc1", "#9467bd",
        "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
      ]
    
    };
   
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener(
      "didFocus",
      this.fetchDays()
    );
  }

  fetchDays = () => {
    const { navigation } = this.props;
    db.habitById(navigation.getParam("habitId"))
      .then(data => {
        habit = data;
        this.setState({
          habit,

          id: habit.habitId
        });
      })
      .then(() => {
        db.getAllDaysForHabit(this.state.id)
          .then(data => {
            let days = data.map(x => {
              key = "" + x.year;
              if (x.month >= 10) key = key + "-" + x.month;
              else key = key + "-0" + x.month;
              if (x.day >= 10) key = key + "-" + x.day;
              else key = key + "-0" + x.day;
              value = { status: x.status, task: x.task };
              return [key, value];
            });

            const obj = Object.fromEntries(days);

              this.calculateStats(data)








            this.setState({
              markedDays: obj,
              days:data,

            });
 


            db.getDayForHabit(this.state.now, this.state.id)
              .then(result => {
               
                this.setState({
                  today: result,
                  isLoading: false
                });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            this.setState = {
              isLoading: false
            };
          });
      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false
        };
      }).catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false
        };
      });
  };

  calculateStats =(data) => 
  {
    let count=0;
    let greatCount=0;
    let neutralCount=0;
    let badCount=0;

    data.forEach(element => {
      if(element.calculated==1)
        count++;
        else
         return;
      if (element.status=='great')
      greatCount++;
      if (element.status=='neutral')
      neutralCount++;
      if (element.status=='bad')
      badCount++;

    });

    let great = new Object();
    let neutral = new Object();
    let bad = new Object();
great.number=100*greatCount/count;
neutral.number=100*neutralCount/count;
bad.number=100*badCount/count;
great.name='Great';
neutral.name='Neutral';
bad.name='Bad';

let pie=[great,neutral,bad];

count++;
//let i=Math.max(0,count-31)
let i=Math.max(0,count-7)  
let days=[];
    
    for(i;i<data.length;i++)
    {
      
      var a = new Object();
      a.name=data[i].day+"/"+data[i].month+"/"+data[i].year;
      a.value=data[i].task.valueOf();
a.time=new Date(data[i].timestamp.valueOf());
      days.push(a)
    }

    this.setState({
      pieChart: pie,
      areaChart: days,
    });

  }

  handlePress = () => {
    if (
      this.state.today.status === "bad" ||
      this.state.today.status === "none"
    ) {
      let todayCopy = this.state.today;
      todayCopy.status = "great";
      this.setState({
        today: todayCopy,
        isLoading: true
      });
    } else if (this.state.today.status === "great") {
      let todayCopy = this.state.today;
      todayCopy.status = "neutral";
      this.setState({
        today: todayCopy,
        isLoading: true
      });
    } else {
      let todayCopy = this.state.today;
      todayCopy.status = "bad";
      this.setState({
        today: todayCopy,
        isLoading: true
      });
    }
   
    this.updateDay();
  };

  updateDay = () => {
    db.updateDayStatus(this.state.today.status, this.state.now, this.state.id)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    if (this.state.today.status === "great") {
      let task;
      if (this.state.habit.currentDayUntilReward === 1) {
        task =
          Number(this.state.today.task) + Number(this.state.habit.rateValue);
      } else {
        task = Number(this.state.today.task);
      }
      let counter = this.state.habit.currentDayUntilReward-1;
      let tempDate = this.state.now.valueOf();
      let month = this.state.now.getMonth();
      while (
        month === this.state.now.getMonth() ||
        month === (this.state.now.getMonth() + 1) % 12
      ) {
        tempDate += 24 * 60 * 60 * 1000;
        db.updateDayTask(task, tempDate, this.state.habit.habitId)
          .then(result => {
            //console.log(result);
          })
          .catch(err => {
            console.log(err);
          });

        month = new Date(tempDate).getMonth();
        counter--;
        if (counter === 0) {
          task += Number(this.state.habit.rateValue);
          counter = Number(this.state.habit.rateDays);
        }
      }
    }

    if (this.state.today.status === "neutral") {
      let task = Number(this.state.today.task);
      let counter = Number(this.state.habit.rateDays);
      let tempDate = this.state.now.valueOf(); //in milis
      let month = this.state.now.getMonth();
      while (
        month === this.state.now.getMonth() ||
        month === (this.state.now.getMonth() + 1) % 12
      ) {
        tempDate += 24 * 60 * 60 * 1000;
        db.updateDayTask(task, tempDate, this.state.habit.habitId)
          .then(result => {
            //console.log(result);
          })
          .catch(err => {
            console.log(err);
          });

        month = new Date(tempDate).getMonth();
        counter--;
        if (counter === 0) {
          task += Number(this.state.habit.rateValue);
          counter = Number(this.state.habit.rateDays);
        }
      }
    }

    if (this.state.today.status === "bad") {
      let task =
        Number(this.state.today.task) - Number(this.state.habit.rateValue);
      let counter = this.state.habit.rateDays;
      let tempDate = this.state.now.valueOf();
      let month = this.state.now.getMonth();
      while (
        month === this.state.now.getMonth() ||
        month === (this.state.now.getMonth() + 1) % 12
      ) {
        tempDate += 24 * 60 * 60 * 1000;
        db.updateDayTask(task, tempDate, this.state.habit.habitId)
          .then(result => {
            //console.log(result);
          })
          .catch(err => {
            console.log(err);
          });

        month = new Date(tempDate).getMonth();
        counter--;
        if (counter === 0) {
          task += Number(this.state.habit.rateValue);
          counter = Number(this.state.habit.rateDays);
        }
      }
    }
    this.fetchDays();
  };

  render() {

    const graphProps = {};
    graphProps.data = this.state.areaChart;
    graphProps.xAccessor = (d) => d.time;
    graphProps.yAccessor = (d) => d.value;


console.table(this.state.areaChart)





    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    let todayDate=this.state.now.toLocaleString().split(",")[0];
    todayDate=todayDate.split('/');
    todayString=todayDate[2]+'-';
    if(todayDate[0]<10)
    todayString+=''+'0'
    todayString+=''+todayDate[0]+'-';
    if(todayDate[1]<10)
    todayString+=''+'0'
    todayString+=''+todayDate[1];
    console.log(todayString)
   
      const height = 180;
    const width = 500; 
    
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            <View>
              <Calendar
                dayComponent={CalendarDayComponent}
                minDate={todayString}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={todayString}
                style={{
                  paddingLeft: 0,
                  paddingRight: 0
                }}
                onDayPress={this.handlePress}
                markedDates={this.state.markedDays}
                firstDay={1}
              />
            </View>
            
          </View>

          <View style={styles.pieContainer} >
          <Text style={styles.chart_title}>Distribution of days</Text>
          <Pie
            pieWidth={150}
            pieHeight={150}
            onItemSelected={this._onPieItemSelected}
            colors={this.state.colors}
            width={width}
            height={height}
            data={this.state.pieChart} />
          <Text style={styles.chart_title}>Progress in the last week</Text>
          <AreaChart
           
            yAccessor={(d) => d.value}
            xAccessor={(d) => d.time}
            data={this.state.areaChart}
            color={this.state.colors[3]} />
        </View>


          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={"#CCCCCC"}
              leftIcon={{ name: "edit" }}
              title="Edit"
              onPress={() => {
                this.props.navigation.navigate("EditHabit", {
                  habitId: `${this.state.id}`
                });
              }}
            />
          </View>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#CCCCCC"
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
  detailButton: {
    marginTop: 10
  },
  pieContainer: {
    backgroundColor:'whitesmoke',
    marginTop: 21,
  },
  chart_title : {
    paddingTop: 15,
    textAlign: 'center',
    paddingBottom: 5,
    paddingLeft: 5,
    fontSize: 18,
    backgroundColor:'white',
    color: 'grey',
    fontWeight:'bold',
  }
});
export default (HabitDetailsScreen);