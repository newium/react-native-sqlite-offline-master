import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import Database from "../../Database2";
import Icon from "react-native-vector-icons/MaterialIcons";





const db = new Database();

class HabitUnfinished extends Component {
  constructor() {
    super();
    this.state = {
      backgroundColor: "red",
      emotion: 'bad',
      dayTask: '',
    };
    getDailyTask();
  }

getDailyTask = () =>
{
  db.getDay(this.props.now-24*60*60*1000,this.props.habitId).then(data => {
    
    this.setState({
      dayTask:data.task,
    
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
    )
      {
        this.state = {
          backgroundColor: "green",
          emotion: 'great',
        };
      }
    else if (this.state.backgroundColor === "green") 
    {
      this.state = {
        backgroundColor: "blue",
        emotion: 'neutral',
      };
    }
    else 
    {
      
      this.state = {
        backgroundColor: "red",
        emotion: 'bad',
      };
    }
  
    updateDay();
    this.props.handleHabit(this.state.emotion);
  }


  updateDay =()=>
  {
   
    db.updateDayStatus(this.state.emotion,this.props.now-24*60*60*1000,this.props.habitId).then((result) => {
      console.log(result);
     
    }).catch((err) => {
      console.log(err);
      
    })
    if(this.state.emotion==='great')
        {
          return;
        }
    
    
     
    if(this.state.emotion==='neutral')
    {
      
        let task=this.state.dayTask;
        let counter=this.props.habit.currentDayUntilReward;
        let tempDate=(this.props.now.valueOf());
        for(let i=0;i<49;i++)
        {
          db.updateDayTask( task,tempDate,habit.habitId).then(
            result => {
              //console.log(result);
              
            }
          ).catch(err => {
            console.log(err);
            
          });

          tempDate+=24*60*60*1000;
          
                if(counter===0)
                {
                  task+=Number(habit.rateValue);
                  counter=Number(this.state.rateDays);
                }
                counter--;
        
        }
    }


    if(this.state.emotion==='bad')
    {
      let task=this.state.dayTask-Number(habit.rateValue);
      let counter=this.props.habit.currentDayUntilReward;
      let tempDate=(this.props.now.valueOf())-24*60*60*1000;
      for(let i=0;i<49;i++)
      {
        db.updateDayTask( task,tempDate,habit.habitId).then(
          result => {
            //console.log(result);
            
          }
        ).catch(err => {
          console.log(err);
          
        });
        tempDate+=24*60*60*1000;
        
              if(counter===0)
              {
                task+=Number(habit.rateValue);
                counter=Number(this.state.rateDays);
              }
              counter--;
       
      }
    }
  
  }


  render() {
    return (
      <View style={styles.listItem}>
        
          <View>
            <Icon name={this.props.habit.icon} size={36} color="#111" />
          </View>
          <View style={{ margin: 5, flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between" }}>
           <View> <Text style={{ fontSize: 24 }}>
              {this.props.habit.habitName}</Text></View>
              <View> <Text>{this.state.dayTask}</Text></View>
            
          </View>
        

        <TouchableOpacity
          onPress={this.handlePress}
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

export default (HabitUnfinished);
