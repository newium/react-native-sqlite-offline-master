import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Step.db";
const database_version = "1.0";
const database_displayname = "Step Habits";
const database_size = 200000;

export default class Database {
  initDB() {
    let db;
    return new Promise(resolve => {
      //console.log("Plugin integrity check ...");
      //console.log("Opening database ...");
      SQLite.openDatabase({ name: "Step.db", createFromLocation: 1 })
        .then(DB => {
          db = DB;
          // console.log("Database OPEN");

          resolve(db);
        })
        .catch(error => {
          //console.log(error);
        });
    });
  }

  closeDatabase() {
    this.initDB()
      .then(db => {
        db.close()
          .then(status => {
            console.log("Database CLOSED");
          })
          .catch(error => {
           // console.log(error);
          });
      })
      .catch(err => {
        //console.log(err);
      });
  }

  listProduct() {
    return new Promise(resolve => {
      const products = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT p.prodId, p.prodName, p.prodImage FROM Product p",
              []
            ).then(([tx, results]) => {
              console.log("Query completed");
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(
                  `Prod ID: ${row.prodId}, Prod Name: ${row.prodName}`
                );
                const { prodId, prodName, prodImage } = row;
                products.push({
                  prodId,
                  prodName,
                  prodImage
                });
              }
              console.log(products);
              resolve(products);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  listHabits() {
    return new Promise(resolve => {
      const habits = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("SELECT * FROM Habit", []).then(([tx, results]) => {
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                habits.push(row);
              }
              resolve(habits);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  listIcons() {
    return new Promise(resolve => {
      const icons = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("SELECT * FROM Icons", []).then(([tx, results]) => {
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                icons.push(row);
              }
              resolve(icons);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  listAvatars() {
    return new Promise(resolve => {
      const avatars = [];
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("SELECT * FROM Avatars", []).then(([tx, results]) => {
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                avatars.push(row);
              }
              resolve(avatars);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }





  buyIcon(name) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Icons SET iconBought = 1 WHERE iconName = ?",
              [name]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  productById(id) {
    console.log(id);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("SELECT * FROM Product WHERE prodId = ?", [id]).then(
              ([tx, results]) => {
                console.log(results);
                if (results.rows.length > 0) {
                  let row = results.rows.item(0);
                  resolve(row);
                }
              }
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  habitById(id) {
    console.log(id);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("SELECT * FROM Habit WHERE habitId = ?", [id]).then(
              ([tx, results]) => {
                console.log(results);
                if (results.rows.length > 0) {
                  let row = results.rows.item(0);
                  resolve(row);
                }
              }
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getUnfinishedDays(now) {
    let days = [];
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM Day WHERE status = "none" and timestamp < ?',
              [now.valueOf()]
            ).then(([tx, results]) => {
              console.log(results);

              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getUncalculatedDaysForHabit(now, habitId) {
    
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT * FROM Day WHERE calculated = 0 and timestamp < ? and habitId= ? order by timestamp ASC",
              [now.valueOf(), habitId]
            ).then(([tx, results]) => {
              var len = results.rows.length;
              let days = [];
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                days.push(row);
              }
              resolve(days);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  setCalculatedDaysForHabit(now, habitId) {
    let days = [];
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Day SET calculated = 1 WHERE timestamp < ? and habitId= ? and calculated = 0",
              [now.valueOf(), habitId]
            ).then(([tx, results]) => {
              console.log(results);

              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  

  getUnfinished(habitId) {
    let day = new Date();
    let days = [];
   day.setHours(0,0,0,0);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM Day WHERE status = "none" and timestamp<? and habitId=? order by timestamp asc',
              [day.valueOf(), habitId]
            ).then(([tx, results]) => {
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                days.push(row);
              }
              resolve(days);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getLastPredictedDayForHabit(habitId) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT * FROM Day WHERE habitId=? order by timestamp desc limit 1",
              [habitId]
            ).then(([tx, results]) => {
              console.log(results);
              if (results.rows.length > 0) {
                let row = results.rows.item(0);
                resolve(row);
              }
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getAllDaysForHabit(habitId) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT * FROM Day WHERE habitId=? order by timestamp ASC",
              [habitId]
            ).then(([tx, results]) => {
              let days = [];
              console.log("Query completed");
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                days.push(results.rows.item(i));
              }
              //console.table(days);

              resolve(days);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getDayForHabit(day, habitId) {
    day=new Date(day);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "SELECT * FROM Day WHERE  day= ? and month= ? and year= ? and habitId=?",
              [day.getDate(), day.getMonth() + 1, day.getFullYear(), habitId]
            ).then(([tx, results]) => {
              console.log(results);
              if (results.rows.length > 0) {
                let row = results.rows.item(0);
                resolve(row);
              }
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  addProduct(prod) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("INSERT INTO Product VALUES (?, ?, ?, ?, ?)", [
              prod.prodId,
              prod.prodName,
              prod.prodDesc,
              prod.prodImage,
              prod.prodPrice
            ]).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  addBlankDay(day, task, habitId) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'INSERT INTO Day ("day", "month", "year","task","habitId","timestamp") VALUES (?, ?, ?,  ?, ?, ?)',
              [
                day.getDate(),
                day.getMonth() + 1,
                day.getFullYear(),
                task,
                habitId,
                day.valueOf()
              ]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  addHabit(habit) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'INSERT INTO Habit ("habitName", "icon", "unit", "startValue", "rateValue", "rateDays", "startDay", "startMonth", "startYear", "currentReward", "currentDayUntilReward", "timestamp") VALUES (?, ?, ?, ?, ?,?,?, ?, ?, ?, ?,?)',
              [
                habit.habitName,
                habit.icon,
                habit.unit,
                habit.startValue,
                habit.rateValue,
                habit.rateDays,
                habit.startDay,
                habit.startMonth,
                habit.startYear,
                habit.currentReward,
                habit.currentDayUntilReward,
                habit.timestamp
              ]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateHabit(id,data) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Habit SET habitName = ?, icon = ?, unit = ?, rateValue = ?, rateDays = ? WHERE habitId= ?",
              [
                data.habitName,
                data.icon,
                data.unit,
               
                data.rateValue,
                data.rateDays,
                
                id
              ]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }


  setCurrentReward(sum,habit) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Habit SET currentReward = ? WHERE habitId= ?",
              [
                sum,
                habit
              ]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }


  setCutoff(cut,habit) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Habit SET currentDayUntilReward = ? WHERE habitId= ?",
              [
                cut,
                habit
              ]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateUserStars(stars) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
           
            tx.executeSql("UPDATE User SET currentStars = ?", [
             stars
            ]).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateUserHealth(health) {
    if (health<0)
    health=0
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
           
            tx.executeSql("UPDATE User SET currentHealth = ?", [
              health
            ]).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateUserAvatar(user) {
    
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
           
            tx.executeSql("UPDATE User SET currentHealth = ?,maximumHealth = ?, currentAvatarId = ?, currentStars = ?", [
              user.currentHealth,user.maximumHealth,user.currentAvatarId,user.currentStars
            ]).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateUserAccess(today) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            let ts= today.valueOf();
            tx.executeSql("UPDATE User SET lastAccess = ?", [
              ts
            ]).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateDayStatus(status, date, habitId) {
    let day = new Date(date);
    
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Day SET status = ? WHERE day= ? and month=? and year=? and habitId=?",
              [
                status,
                day.getDate(),
                day.getMonth() + 1,
                day.getFullYear(),
                habitId
              ]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  failUnfinished(date, habitId) {
    let day = new Date(date);
   day.setHours(0,0,0,0);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Day SET status = 'bad' WHERE timestamp<? and habitId=? and status='none'",
              [
                
                day.valueOf(),
                habitId
              ]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateDayTask(task, date, habitId) {
    let day = new Date(date);
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Day SET task = ? WHERE day= ? and month=? and year=? and habitId=?",
              [
                task,
                day.getDate(),
                day.getMonth() + 1,
                day.getFullYear(),
                habitId
              ]
            ).then(([tx, results]) => {
              resolve(results);
            }).catch(err => {
              console.log(err);
            });;
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  updateProduct(id, prod) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              "UPDATE Product SET prodName = ?, prodDesc = ?, prodImage = ?, prodPrice = ? WHERE prodId = ?",
              [prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice, id]
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  deleteProduct(id) {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql("DELETE FROM Product WHERE prodId = ?", [id]).then(
              ([tx, results]) => {
                console.log(results);
                resolve(results);
              }
            );
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  getUser() {
   
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(tx => {
            // tx.executeSql('SELECT * FROM User,Avatars WHERE avatarId = currentAvatarId Or 1', []).then(([tx,results]) => {
            tx.executeSql("SELECT * FROM User", []).then(([tx, results]) => {
              console.log(results);
              if (results.rows.length > 0) {
                let row = results.rows.item(0);
                resolve(row);
              }
            });
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
}
