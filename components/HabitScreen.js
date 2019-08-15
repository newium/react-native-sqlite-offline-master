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
import { ListItem, Button, Icon } from "react-native-elements";
import { NavigationEvents } from "react-navigation";

//import Icon from "react-native-vector-icons/MaterialIcons";
import AvatarBar from "./small-components/AvatarBar";
import Habit from "./small-components/Habit";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation
} from "react-native-popup-dialog";
import HabitUnfinished from "./small-components/HabitUnfinished";

import Database from "../Database2";
import AvatarSelectItem from "./small-components/AvatarSelectItem";
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
      )
    };
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      habits: [],
      lastAccess: "",
      now: new Date(),
      user: {},
      toDays: [],
      unfinished: 0,
      notFound:
        "You have no habits yet :(\nPlease click (+) button to add some",
      doCalc: false,
      giveYesterdayAChance: true,
      tempEmotion: "temporary",
      refreshMe: false,
      failPoints: 0,
      showAvatarDialogue: false,
      showBuyAvatarDialogue: false,
      potentialAvatar:{},
    };
  }

  componentDidMount() {
    /*  this._subscribe = this.props.navigation.addListener("didFocus", () => {
     this.getHabits();
      
    }); */
    this.getHabits();
    this.getAvatars();
    this.setState({
      refreshMe: !this.state.refreshMe,
      /* tempEmotion: "temps" */
    });
  }

  calculatePoints = () => {
    let nowZero = this.state.now;
    nowZero.setHours(0, 0, 0, 0);
    let pointSum = 0;

    habits = this.state.habits;
    habits.forEach(habit => {
      db.getUncalculatedDaysForHabit(nowZero, habit.habitId)
        .then(result => {
          let habitSum = habit.currentReward;
          for (i = 0; i < result.length; i++) {
            let thStatus = result[i].status;
            if (thStatus === "great") {
              habitSum++;
              pointSum += habitSum;
            } else if (thStatus === "bad") {
              if (habitSum >= 0) habitSum = -10;
              else habitSum -= 1;

              pointSum += habitSum;
            } else if (thStatus === "neutral") {
              pointSum++;
            }
          }
          console.warn(pointSum);

          db.setCalculatedDaysForHabit(nowZero, habit.habitId)
            .then(result => {})
            .catch(err => {
              console.log(err);
            });

          db.setCurrentReward(habitSum, habit.habitId)
            .then(result => {})
            .catch(err => {
              console.log(err);
            });

          let newUser = this.state.user;
          console.warn(pointSum);
          if (pointSum < 0) {
            if (0 - pointSum < this.state.user.currentHealth)
              newUser.currentHealth -= pointSum;
            else {
              pointSum += this.state.user.currentHealth;
              newUser.currentHealth = 0;
              this.forceUpdate();
              this.state.tempEmotion = "dead";
              newUser.currentStars = Math.max(
                0,
                (this.state.user.currentStars += pointSum)
              );
            }
          } else {
            if (
              pointSum <
              this.state.user.maximumHealth - this.state.user.currentHealth
            ) {
              newUser.currentHealth += pointSum;
            } else {
              pointSum -=
                this.state.user.maximumHealth - this.state.user.currentHealth;
              newUser.currentStars += pointSum;
              newUser.currentHealth = this.state.user.maximumHealth;
            }
          }
          console.table(newUser);
          this.setState(
            {
              user: newUser
            },
            () => {
              db.updateUserStars(this.state.user.currentStars)
                .then(result => {})
                .catch(err => {
                  console.table(this.state.user);
                  console.log(err);
                });
              db.updateUserHealth(this.state.user.currentHealth)
                .then(result => {})
                .catch(err => {
                  console.log(err);
                });
            }
          );
        })
        .catch(err => {
          console.log(err);
        });
    });

    this.setState({
      calculated: true
    });
    console.table(this.state.user);
  };

  failEmptyDays = () => {
    this.state.habits.forEach(habit => {
      let cutoff1 = habit.currentDayUntilReward;
      db.getUnfinished(habit.habitId)
        .then(results => {
          this.setState({
            unfinished: this.state.unfinished++
          });
          cutoff1--;
          if (cutoff1 == 0) cutoff1 = habit.rateDays;
          let newLowerTask;
          if (results[0]) newLowerTask = results[0].task;
          for (let i = 0; i < results.length; i++) {
            newLowerTask -= habit.rateValue;
            if (habit.rateValue > 0 && newLowerTask < 0) newLowerTask = 0;
            db.updateDayStatus("bad", results[i].timestamp, habit.habitId)
              .then(result => {
                db.updateDayTask(
                  newLowerTask,
                  results[i].timestamp + 24 * 60 * 60 * 1000,
                  habit.habitId
                )
                  .then(result => {
                    cutoff1--;
                    if (cutoff1 == 0) cutoff1 = habit.rateDays;
                  })
                  .catch(err => {});
              })
              .catch(err => {});
          }
        })
        .then(() => {
          db.setCutoff(cutoff1, habit.habitId)
            .then(() => {
              this.addMonth();
            })
            .catch(err => {});
        })
        .catch(err => {
          console.log(err);
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  updateUserAccess = () => {
    let data = this.state.now.toString();
     db.updateUserAccess(data)
      .then(result => {
    let day = new Date(this.state.lastAccess);
    //day.setHours(0,0,0,0);
    day = day.getDate();

    this.setState({
      isLoading: false,
      refreshMe: !this.state.refreshMe,
      giveYesterdayAChance:
        this.state.giveYesterdayAChance && this.state.now.getDate() != day
    });
         })
      .catch(err => {
        console.log(err);
      });  
  };

  getHabits() {
    let habits = [];

    db.listHabits()
      .then(result => {
        habits = result;

        this.setState({
          habits: habits
          //  isLoading:false,
        });
        // db.closeDatabase();
        this.getUser();
        this.setState({
          refreshMe: !this.state.refreshMe
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getAvatars = () => {
    db.listAvatars()
      .then(result => {
        this.setState({
          avatars: result
        });
      })
      .catch(() => {});
  };

  getUser = () => {
    db.getUser()
      .then(data => {
        user = data;
        this.setState({
          user,
          lastAccess: new Date(user.lastAccess),
          calculated:
            new Date(user.lastAccess).getDate() == this.state.now.getDate()
        });

        this.failEmptyDays();
        this.updateUserAccess();
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleHabit = emotion => {
    this.setState({
      refreshMe: !this.state.refreshMe,
      tempEmotion: emotion
    });
  };

  addMonth = () => {
    if (this.state.lastAccess.getMonth() != this.state.now.getMonth()) {
      this.state.habits.forEach(habit => {
        let day2 = this.state.now;
        let month = (day2.getMonth() + 1) % 12;
        let cutoff1 = habit.currentDayUntilReward;
        while (day2.getMonth() != month) {
          cutoff1--;
          if (cutoff1 == 0) {
            cutoff1 = habit.rateDays;
          }
          day2 += 24 * 60 * 60 * 1000;
        }
        let day = day2; //first day of the new month
        /* let cutoff2=cutoff1;
        while (day2.getMonth()!=((month+1)%12))
          {
            cutoff2--;
            if (cutoff2==0)
            {
              cutoff2=habit.rateDays;
            }
            day2+=24*60*60*1000;
          }
 */

        month = day.getMonth();
        let nextMonth = (day.getMonth() + 1) % 12;

        let dayMilis = day.valueOf();
        let task = Number(habit.startValue);
        let counter = cutoff1;
        while (month === nextMonth) {
          console.log(task);
          console.log(counter);
          counter--;
          if (counter === 0) {
            task += Number(habit.rateValue);
            counter = Number(habit.rateDays);
          }
          db.addBlankDay(day, task, habit.habitId)
            .then(result => {
              console.log(result);
            })
            .catch(err => {
              console.log(err);
            });
          dayMilis += 24 * 60 * 60 * 1000;
          day = new Date(dayMilis);
          month = day.getMonth();
        }
      });
    }
  };

  pointsReduce = points => {
    let newUser = this.state.user;
    newUser.currentStars -= points;
    this.setState(
      {
        user: newUser
      },
      () => {
        db.updateUserStars(newUser.currentStars)
          .then(result => {})
          .catch(err => {
            console.log(err);
          });
      }
    );
  };

  buyAvatar = () =>
  {
    let newUser= this.state.user;
    newUser.currentStars-=this.state.potentialAvatar.avatarPrice;
    newUser.currentAvatarId=this.state.potentialAvatar.avatarID;
    newUser.maximumHealth=this.state.potentialAvatar.maximumHealth;
    newUser.currentHealth=this.state.potentialAvatar.currentHealth;
    this.setState({
      user:newUser,
      showAvatarBuyDialogue:false,
      showAvatarDialogue:false,
    })
    db.updateUserAvatar(newUser).then().catch();
  }

  keyExtractor = (item, index) => index.toString();

  renderRegular = ({ item }) => (
    <Habit
      habit={item}
      handleHabit={this.handleHabit}
      now={this.state.now}
    ></Habit>
  );

  renderAvatar = ({ item }) => (
    
    <AvatarSelectItem
      avatar={item}
       onPress={() =>
    {
      console.log(item.avatarPrice+'      '+this.state.user.currentStars)
      if(item.avatarPrice<=this.state.user.currentStars)
      {
        this.setState({
        potentialAvatar: item,
        showBuyAvatarDialogue: true
      });
      }     
      }
    }
      buyable={item.avatarPrice<=this.state.user.currentStars}
    ></AvatarSelectItem>
   
  );

  renderUnfinished = ({ item }) => {
    return (
      <HabitUnfinished
        habit={item}
        handleHabit={this.handleHabit}
        now={this.state.now}
      ></HabitUnfinished>
    );
  };

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
          triggerShop={()=> {
            this.setState({
              showAvatarDialogue:true
            })
          }}
            emotion={this.state.tempEmotion}
            points={this.state.user.currentStars}
            currentHealth={this.state.user.currentHealth}
            maximumHealth={this.state.user.maximumHealth}
            pointsReduce={this.pointsReduce}
            avatarId={this.state.user.currentAvatarID}
          />
          <Text style={styles.message}>{this.state.notFound}</Text>
        </View>
      );
    }

    return (
      <View>
        <AvatarBar
        triggerShop={()=> {
            this.setState({
              showAvatarDialogue:true
            })
          }}
          emotion={this.state.tempEmotion}
          points={this.state.user.currentStars}
          currentHealth={this.state.user.currentHealth}
          maximumHealth={this.state.user.maximumHealth}
          pointsReduce={this.pointsReduce}
          avatarId={this.state.user.currentAvatarId}
        />
        <NavigationEvents
          onWillFocus={payload => {
            console.table(this.state.refreshMe);
            let habits = [];
            this.setState(
              {
                isLoading: false
              },
              () => {
                db.getUser()
                  .then(data => {
                    user = data;
                    this.setState({
                      user
                    });
                  })
                  .catch(err => {
                    console.log(err);
                  });

                db.listHabits()
                  .then(result => {
                    habits = result;

                    this.setState({
                      habits: habits,
                      isLoading: false
                    });
                    // db.closeDatabase();

                    this.setState({
                      refreshMe: !this.state.refreshMe
                    });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            );
          }}
          onDidFocus={payload =>
            this.setState({ refreshMe: !this.state.refreshMe })
          }
        />
        <Dialog
          onDismiss={() => {
            this.setState({ giveYesterdayAChance: false });
            //  this.calculatePoints();
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
              title="Here's a second chance for yesterday"
              style={{
                backgroundColor: "#F7F7F8"
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
                }}
                key="button-1"
              />
              <DialogButton />
            </DialogFooter>
          }
        >
          <DialogContent
            style={{
              backgroundColor: "#F7F7F8"
            }}
          >
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.habits}
              renderItem={this.renderUnfinished}
              extraData={this.state.refreshMe}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({ showAvatarDialogue: false });
          }}
          width={0.9}
          height={0.5}
          visible={this.state.showAvatarDialogue}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({ showAvatarDialogue: false });
            return true;
          }}
          dialogTitle={
            <DialogTitle title="Choose an avatar" hasTitleBar={false} />
          }
          actions={[
            <DialogButton
              text="Select"
              onPress={() => {
                this.setState({ showAvatarDialogue: false });
              }}
              key="button-1"
            />
          ]}>
          <DialogContent>
          <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.avatars}
              renderItem={this.renderAvatar}
              extraData={this.state.refreshMe}
              style={{borderTopColor:'#ddd',borderTopWidth:2,marginBottom:50}}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          onDismiss={() => {
            this.setState({ showBuyAvatarDialogue: false });
          }}
          width={0.8}
          visible={this.state.showBuyAvatarDialogue}
          rounded
          actionsBordered
          // actionContainerStyle={{
          //   height: 100,
          //   flexDirection: 'column',
          // }}
          dialogTitle={
            <DialogTitle
              title="Purchase Avatar"
              style={{
                backgroundColor: "#F7F7F8"
              }}
              hasTitleBar={false}
              align="left"
            />
          }
          footer={
            
              <DialogFooter>
                <DialogButton
                  text="BUY"
                  bordered
                  onPress={() => {
                    this.buyAvatar();
                    
                  }}
                  key="button-2"
                />
                <DialogButton
                  text="CANCEL"
                  bordered
                  onPress={() => {
                    this.setState({
                      showBuyAvatarDialogue: false
                    });
                  }}
                  key="button-1"
                />
              </DialogFooter>
            
          }>
          <DialogContent
            style={{
              backgroundColor: "#F7F7F8"
            }}>
            
              <Text>
                Are you sure you want to get this avatar?
              </Text>
            <Text>
                {this.state.potentialAvatar.avatarID==this.state.user.currentAvatarId?
                'This will reset the health of your current avatar':
                'You will lose the current avatar until you re-purchase it'}
            </Text>
          </DialogContent>
        </Dialog>




        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.habits}
          renderItem={this.renderRegular}
          extraData={this.state.refreshMe}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
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
