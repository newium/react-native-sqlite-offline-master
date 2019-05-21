import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database2';

const db = new Database();

export default class HabitAddScreen extends Component {
                 static navigationOptions = {
                   title: "Add Habit"
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
                     isLoading: false
                   };
                 }

                 updateTextInput = (text, field) => {
                   const state = this.state;
                   state[field] = text;
                   this.setState(state);
                 };

                 saveHabit() {
                   this.setState({
                     isLoading: true
                   });
                   let data = {
                     habitName: this.state.habitName,
                     icon: this.state.icon,
                     unit: this.state.unit,
                     startValue:Number( this.state.startValue),
                     rateValue: Number(this.state.rateValue),
                     rateDays: Number(this.state.rateDays),
                     startDay: this.state.startDate.getDate(),
                     startMonth: this.state.startDate.getMonth(),
                     startYear: this.state.startDate.getFullYear(),
                     timestamp: this.state.startDate.valueOf(),
                     currentReward: 0,
                     currentDayUntilReward: this.state.rateDays
                   };
                   db.addHabit(data)
                     .then(result => {
                       console.log(result);
                       console.log(result.insertId);
                       this.setState({
                         isLoading: false,
                         habitId: result.insertId
                       });
                     })
                     .then(() => {
                      let day=this.state.startDate
                      let dayMilis=day.valueOf();
                      let task=Number(this.state.startValue);
                      let counter=Number(this.state.rateDays);
                      for(let i=0;i<50;i++)
                      {
                        console.log(task);
                        console.log(counter);
                          db.addBlankDay(day, task,this.state.habitId).then(
                          result => {
                            //console.log(result);
                            
                          }
                        );
                        dayMilis+=24*60*60*1000;
                        day=new Date(dayMilis);
                        counter--;
                        if(counter===0)
                        {
                          task+=Number(this.state.rateValue);
                          counter=Number(this.state.rateDays);
                        }
                          
                      }
                       

                      
                     }
                     
                     
                     ).then(() => { 
                       this.props.navigation.state.params
                         .onNavigateBack;
                       this.props.navigation.goBack();
                      })
                     .catch(err => {
                       console.log(err);
                       this.setState({
                         isLoading: false
                       });
                     });
                 }

                 render() {
                   if (this.state.isLoading) {
                     return (
                       <View style={styles.activity}>
                         <ActivityIndicator
                           size="large"
                           color="#0000ff"
                         />
                       </View>
                     );
                   }
                   return (
                     <ScrollView style={styles.container}>
                       <View style={styles.subContainer}>
                         <TextInput
                           placeholder={"Habit Name"}
                           value={this.state.habitName}
                           onChangeText={text =>
                             this.updateTextInput(
                               text,
                               "habitName"
                             )
                           }
                         />
                       </View>

                       <View style={styles.subContainer}>
                         <TextInput
                           placeholder={"Icon name"}
                           value={this.state.icon}
                           
                           onChangeText={text =>
                             this.updateTextInput(text, "icon")
                           }
                         />
                       </View>
                       <View style={styles.subContainer}>
                         <TextInput
                           placeholder={"Unit"}
                           value={this.state.unit}
                           onChangeText={text =>
                             this.updateTextInput(text, "unit")
                           }
                         />
                       </View>
                       <View style={styles.subContainer}>
                         <TextInput
                           placeholder={"Start Value"}
                           value={this.state.startValue}
                           keyboardType="numeric"
                           onChangeText={text =>
                             this.updateTextInput(
                               text,
                               "startValue"
                             )
                           }
                         />
                       </View>
                       <View style={styles.subContainer}>
                         <TextInput
                           placeholder={"Rate Value"}
                           value={this.state.rateValue}
                           keyboardType="numeric"
                           onChangeText={text =>
                             this.updateTextInput(
                               text,
                               "rateValue"
                             )
                           }
                         />
                       </View>
                       <View style={styles.subContainer}>
                         <TextInput
                           placeholder={"Rate Days"}
                           value={this.state.rateDays}
                           keyboardType="numeric"
                           onChangeText={text =>
                             this.updateTextInput(
                               text,
                               "rateDays"
                             )
                           }
                         />
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
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})