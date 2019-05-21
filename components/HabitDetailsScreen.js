import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Database from '../Database2';
import { Calendar } from 'react-native-calendars';
import CalendarDayComponent from './CalendarDayComponent';

const db = new Database();

export default class HabitDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Habit Details',
  }

  constructor() {
    super();
    this.state = {
      isLoading: true,
      markedDays: {},
      id:'',
      habit:{},
      today: '',
      now:new Date(),
    };
    console.log((new Date()).toISOString().split('T')[0])
    console.table(this.state)
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      const { navigation } = this.props;
      db.habitById(navigation.getParam('habitId')).then((data) => {
        
        habit = data;
        this.setState({
          habit,
          
          id: habit.habitId
        });
      }).then(() => {
        db.getAllDaysForHabit(navigation.getParam('habitId')).then(data => {
          let days = data.map( x => 
            {
              key=""+x.year;
          if(x.month>=10)
            key=key+"-"+x.month;
          else
            key=key+"-0"+x.month;
          if(x.day>=10)
            key=key+"-"+x.day;
          else
            key=key+"-0"+x.day;
              value={ 'status':x.status,'task':x.task};
              return [key,value]
            });
            
            

            const obj = Object.fromEntries(days)
            


          this.setState({
            markedDays:obj,
            
          });
          
          db.getDayForHabit(this.state.now,navigation.getParam('habitId')).then((result) => {
            this.setState({
              today:result,
              isLoading: false
            });

          }).catch((err) => {
            console.log(err);
          });


        })
        .catch(err => {
          console.log(err);
          this.setState = {
            isLoading: false
          };
        });



      }).catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false
        }
      })
    });
  }


  
  deleteProduct(id) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    db.deleteProduct(id).then((result) => {
      console.log(result);
      this.props.navigation.goBack();
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }














  handlePress = () => {
    

    if (     this.state.today.status === "bad" ||  this.state.today.status === "none" )
      {
        let todayCopy=this.state.today;
        todayCopy.status ="great"
        this.setState({
          today: todayCopy,
          isLoading: true
        });
      }
    else if (this.state.today.status === "great") 
    {
      let todayCopy=this.state.today;
        todayCopy.status = "neutral"
        this.setState({
          today: todayCopy,
          isLoading: true
        });
     
    }
    else 
    {
      let todayCopy=this.state.today;
        todayCopy.status = "bad"
        this.setState({
          today: todayCopy,
          isLoading: true
        });
      
    }
   
    this.updateDay();
    
  }


  updateDay =()=>
  {
    
    db.updateDayStatus(this.state.today.status,this.state.now,this.state.id).then((result) => {
      console.log(result);
     
    }).catch((err) => {
      console.log(err);
      
    })
    if(this.state.today.status==='great')
        {
          
        }
    
    
     
    if(this.state.today.status==='neutral')
    {
      
        let task=this.state.today.task;
        let counter=this.state.habit.currentDayUntilReward;
        let tempDate=(this.state.now.valueOf());
        for(let i=0;i<49;i++)
        { 
          tempDate+=24*60*60*1000;
          db.updateDayTask( task,tempDate,this.state.habit.habitId).then(
            result => {
              //console.log(result);
              
            }
          ).catch(err => {
            console.log(err);
            
          });

         
          
                if(counter===0)
                {
                  task+=Number(this.state.habit.rateValue);
                  counter=Number(this.state.habit.rateDays);
                }
                counter--;
        
        }
    }


    if(this.state.emotion==='bad')
    {
      let task=this.state.today.task-Number(this.state.habit.rateValue);
      let counter=this.state.habit.currentDayUntilReward;
      let tempDate=(this.state.now.valueOf());
      for(let i=0;i<49;i++)
      {
        tempDate+=24*60*60*1000;
        db.updateDayTask( task,tempDate,this.state.habit.habitId).then(
          result => {
            //console.log(result);
            
          }
        ).catch(err => {
          console.log(err);
          
        });
        
        
              if(counter===0)
              {
                task+=Number(this.state.habit.rateValue);
                counter=Number(this.state.habit.rateDays);
              }
              counter--;
       
      }
    }


    db.getAllDaysForHabit(this.state.id).then(data => {
      let days = data.map( x => 
        {

          key=""+x.year;
          if(x.month>=10)
            key=key+"-"+x.month;
          else
            key=key+"-0"+x.month;
          if(x.day>=10)
            key=key+"-"+x.day;
          else
            key=key+"-0"+x.day;
          value={ 'status':x.status,'task':x.task};
          return [key,value]
        });
        
        

        const obj = Object.fromEntries(days)


        
      this.setState({
        markedDays:obj,
        
      });
      db.getDayForHabit(this.state.now,this.state.id).then((result) => {
        this.setState({
          today:result,
          isLoading: false
        });

      }).catch((err) => {
        console.log(err);
      });
  
  
    })
    console.table(this.state);
  }































  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }


    
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            
            <View>
            <Calendar
          
          dayComponent={CalendarDayComponent}
          minDate={this.state.now.toISOString().split('T')[0]}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
 // maxDate={this.state.now.toISOString().split('T')[0]}
          style={{
            paddingLeft: 0, paddingRight: 0
          }}
          onDayPress={this.handlePress}
          markedDates={this.state.markedDays}
         firstDay={1}
          
        />
            </View>
           {/*  <View>
              <Text style={{fontSize: 16}}>Product ID: {this.state.product.prodId}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Product Name: {this.state.product.prodName}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Product Desc: {this.state.product.prodDesc}</Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Product Price: {this.state.product.prodPrice}</Text>
            </View> */}
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#CCCCCC'}
              leftIcon={{name: 'edit'}}
              title='Edit'
              onPress={() => {
                this.props.navigation.navigate('EditProduct', {
                  prodId: `${this.state.id}`,
                });
              }} />
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#999999'}
              color={'#FFFFFF'}
              leftIcon={{name: 'delete'}}
              title='Delete'
              onPress={() => this.deleteProduct(this.state.id)} />
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
  },
  detailButton: {
    marginTop: 10
  }
})
