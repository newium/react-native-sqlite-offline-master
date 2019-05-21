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

export default class HabitScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Ready to seize the day?",
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: "transparent" }}
          icon={{
            name: "add-circle",
            style: { paddingRight: 60, fontSize: 36 }
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
      now: new Date(),
      user: {},
      unfinishedDays: [],
      notFound: "You have no habits yet :(\nPlease click (+) button to add some",
      doCalc: false,
      giveYesterdayAChance:false,
      avatarEmotion: 'neutral',
    
    };


    
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener("didFocus", () => {
                


                
                this.getHabits();
                this.getUser();

               


                
                this.updateUserAccess(this.state.now);
                
                
                /* let yesterday = new Date(this.state.now - (24 * 60 * 60 * 1000));
                console.log(yesterday);
                this.getUnfinishedDays(yesterday);
 */



            })
          }



  calculatePoints(){

    let unCalcDays =[];
    let nowZero=this.state.now;
    nowZero.setHours(0,0,0,0);
    let pointSum=0;
    this.state.habits.forEach(habit => {
      db.getUncalculatedDaysForHabit(nowZero,habit.habitId)
          .then(result => {
              let habitSum=habit.currentReward;
            for (i=0;i<result.rows.length;i++)
              {
                let thStatus=result.rows.item(i).status
                if(thStatus==='great')
                {
                    habitSum++;
                    pointSum+=habitSum;
                    habit.currentDayUntilReward--;

                    let task=Number(result.rows.item(i).task);
                    let counter=Number(habit.currentDayUntilReward);
                    let tempDate=(result.rows.item(i).timestamp)+24*60*60*1000;
                    for(let i=0;i<49;i++)
                    {
                      if(counter===0)
                            {
                              task+=Number(habit.rateValue);
                              counter=Number(this.state.rateDays);
                            }
                      
                      counter--;
                      tempDate+=24*60*60*1000;
                    }
                    
                    db.addBlankDay(tempDate, task,habit.habitId).then(
                      result => {
                        //console.log(result);
                        
                      }
                    );

                }
                else if(thStatus==='bad')
                  {
                    if(habitSum>=0)
                      habitSum=-10;
                    else
                      habitSum-=-10;

                    pointSum+=habitSum;


                    let task=Number(result.rows.item(i).task)-Number(habit.rateValue);
                    let counter=Number(habit.rateDays);
                    let tempDate=(result.rows.item(i).timestamp)+24*60*60*1000;
                    for(let j=0;j<49;j++)
                    {
                     
                      {
                        db.updateDayTask( task,tempDate,habit.habitId).then(
                          result => {
                            //console.log(result);
                            
                          }
                        );
                      }
                      
                      tempDate+=24*60*60*1000;
                      counter--;
                            if(counter===0)
                            {
                              task+=Number(habit.rateValue);
                              counter=Number(this.state.rateDays);
                            }
                    }
                    db.addBlankDay(tempDate, task,habit.habitId).then(
                      result => {
                        //console.log(result);
                        
                      }
                    );


                  }
                  else if(thStatus==='neutral')
                  {
                    let task=Number(result.rows.item(i).task);
                    let counter=Number(habit.rateDays);
                    let tempDate=(result.rows.item(i).timestamp)+24*60*60*1000;
                    for(let i=0;i<49;i++)
                    {
                      db.updateDayTask( task,tempDate,habit.habitId).then(
                        result => {
                          //console.log(result);
                          
                        }
                      );
                      tempDate+=24*60*60*1000;
                      counter--;
                            if(counter===0)
                            {
                              task+=Number(habit.rateValue);
                              counter=Number(this.state.rateDays);
                            }
                    }

                    db.addBlankDay(tempDate, task,habit.habitId).then(
                      result => {
                        //console.log(result);
                        
                      }
                    );
                  }
                                
                    

              }
            

          }).then((result) => {
            db.setCalculatedDaysForHabit(nowZero,habit.habitId).then(
              (result) => {
              
            }).catch((err) => {
              console.log(err);
            });
            
          })
          .catch(err => {
            console.log(err);
          
            
          });
    });
    if(pointSum<0)
    {
      if((0-pointSum)<this.state.user.currentHealth)
        this.state.user.currentHealth-=pointSum;
      else
        {
          pointSum+this.state.user.currentHealth;
          this.state.user.currentHealth=0;
          this.state.user.currentStars=Math.max(0,this.state.user.currentStars-=pointSum)
        }
    }
    else
    {
      if((pointSum)<this.state.user.maximumHealth-this.state.user.currentHealth)
      {
        this.state.user.currentHealth+=pointSum;
      }
      else
      {
        pointSum-=(this.state.user.maximumHealth-this.state.user.currentHealth);
        this.state.user.currentStars+=pointSum;
        this.state.user.currentHealth=this.state.user.maximumHealth;
      }
    }
    
    




  }



  updateUserAccess =()=> 
  {
    let data= this.state.now.toString();
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


  getUnfinishedDays =(date) =>{
    let days = [];
   
    db.getUnfinishedDayForDate(date)
      .then(data => {
        days = data;
        
                if (this.state.unfinishedDays.length !== 0)
                    this.setState({
                        giveYesterdayAChance: true,
                    });
                else {
                    console.table(this.state.lastAccess);
                    console.log("YES IM IN THE DATABASE, WALLNUT")
                    if (date.getDate() != this.state.lastAccess.getDate()) {
                        this.calculatePoints();

                    }
                }
        this.setState({
          unfinishedDays :days,
          isLoading: false
        });
        console.table(this.state)
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
      .then(result => {
        for (i=0;i<result.rows.length;i++)
        habits.push(result.rows.item(i));
      
        
        this.setState({
          habits: habits,
        });
        
      })
      .catch(err => {
        console.log(err);
        
      });
  }

  getUser=()=> {
   
    db.getUser()
      .then(data => {
        user = data;
        this.setState({
          user,
          lastAccess:new Date(user.lastAccess),
          isLoading: false,
        });
        console.log('cowabunga it is')
console.table(this.state)


      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false
        };
      });
      
      
  }







handleHabit = emotion =>
{
   this.setState({
          avatarEmotion: emotion,
        });
}






  keyExtractor = (item, index) => index.toString();

  renderRegular = ({ item }) => (
   
<Habit habit= {item}
handleHabit={this.handleHabit}
now={this.state.now}
>
</Habit>
  );

  renderUnfinished=({item})=>
  {

    <HabitUnfinished habit= {item}
    handleHabit={this.handleHabit}
    now={this.state.now}
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
    if (this.state.habits.length === 0) {
      return (
        <View>
        <AvatarBar 
          emotion={this.state.avatarEmotion}
        />
          <Text style={styles.message}>{this.state.notFound}</Text>
        </View>
      );
    }
    
    return (
      <View>  
        <AvatarBar 
          emotion={this.state.avatarEmotion}
        />

         <Dialog
          onDismiss={() => {
            this.setState({ giveYesterdayAChance: false });
            this.calculatePoints();
          }}
          width={0.9}
          visible={this.state.giveYesterdayAChance}
          rounded
          actionsBordered
          // actionContainerStyle={{
          //   height: 100,
          //   flexDirection: 'column',
          // }}
          dialogTitle={
            <DialogTitle
              title="You have been neglecting your habits.\nHere's a second chance for yesterday"
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
                text="COMMIT"
                bordered
                onPress={() => {
                  this.setState({ giveYesterdayAChance: false });
                  this.calculatePoints();
                          }
                          }
                key="button-1"
              />
              <DialogButton
                text="OK"
                bordered
                onPress={() => {
                  this.setState({ giveYesterdayAChance: false });
                  this.calculatePoints();
                          }
                          }
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
          renderItem={this.renderRegular}
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
