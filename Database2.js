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
    return new Promise((resolve) => {
      console.log("Plugin integrity check ...");
      SQLite.echoTest()
        .then(() => {
          console.log("Integrity check passed ...");
          console.log("Opening database ...");
          SQLite.openDatabase(
            { name: 'Step.db', createFromLocation : 1}
           // database_name,
           // database_version,
           // database_displayname,
           // database_size
          )
            .then(DB => {
              db = DB;
              console.log("Database OPEN");
              db.executeSql('SELECT 1 FROM Product LIMIT 1').then(() => {
                  console.log("Database is ready ... executing query ...");
              }).catch((error) =>{
                  console.log("Received error: ", error);
                  console.log("Database not yet ready ... populating data");
                  db.transaction((tx) => {
                      // recreate table
                  }).then(() => {
                      console.log("Tables created successfully");
                  }).catch(error => {
                      console.log(error);
                  });
              });
              resolve(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log("echoTest failed - plugin not functional");
        });
      });
  };

  closeDatabase(db) {
    if (db) {
      console.log("Closing DB");
      db.close()
        .then(status => {
          console.log("Database CLOSED");
        })
        .catch(error => {
          this.errorCB(error);
        });
    } else {
      console.log("Database was not OPENED");
    }
  };

  listProduct() {
    return new Promise((resolve) => {
      const products = [];
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT p.prodId, p.prodName, p.prodImage FROM Product p', []).then(([tx,results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`Prod ID: ${row.prodId}, Prod Name: ${row.prodName}`)
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
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  listHabits() {
    return new Promise((resolve) => {
      
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Habit', []).then(([tx,results]) => {
            
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  productById(id) {
    console.log(id);
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Product WHERE prodId = ?', [id]).then(([tx,results]) => {
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  habitById(id) {
    console.log(id);
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Habit WHERE habitId = ?', [id]).then(([tx,results]) => {
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  getUnfinishedDays(now) {
    let days = [];
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Day WHERE status = "none" and timestamp < ?', [now.valueOf()]).then(([tx,results]) => {
            
            
            console.log(results);
            
              resolve(results);
            
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  getUncalculatedDaysForHabit(now, habitId) {
    let days = [];
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Day WHERE calculated = 0 and timestamp < ? and habitId= ? order by timestamp ASC', [now.valueOf(),habitId]).then(([tx,results]) => {
            
            
            console.log(results);
            
              resolve(results);
            
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  setCalculatedDaysForHabit(now, habitId) {
    let days = [];
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE Day SET calculated = 1 WHERE timestamp < ? and habitId= ? ', [now.valueOf(),habitId]).then(([tx,results]) => {
            
            
            console.log(results);
            
              resolve(results);
            
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  getUnfinishedDayForDate(date) {
    
    
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Day WHERE status = "none" and day= ? and month= ? and year= ? ', [date.getDate(),date.getMonth()+1,date.getFullYear()]).then(([tx,results]) => {
            
            
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  getUnfinishedDayForHabit(date,habitId) {
    
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Day WHERE status = "none" and day= ? and month= ? and year= ? and habitId=?', [date.getDate(),date.getMonth()+1,date.getFullYear(),habitId]).then(([tx,results]) => {
            
            
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  getLastPredictedDayForHabit(habitId) {
    
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Day WHERE habitId=? order by timestamp desc limit 1', [habitId]).then(([tx,results]) => {
            
            
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  getAllDaysForHabit(habitId) {
    
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Day WHERE habitId=? order by timestamp ASC', [habitId]).then(([tx,results]) => {
            
            let days=[]
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
                days.push(results.rows.item(i));
            }
            //console.table(days);
           
            resolve(days);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }





  getDayForHabit(day,habitId) {
    
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Day WHERE  day= ? and month= ? and year= ? and habitId=?', [day.getDate(),day.getMonth()+1,day.getFullYear(), habitId]).then(([tx,results]) => {
            
            
            console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  addProduct(prod) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO Product VALUES (?, ?, ?, ?, ?)', [prod.prodId, prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  
  addBlankDay(day, task, habitId) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO Day ("day", "month", "year","task","habitId","timestamp") VALUES (?, ?, ?,  ?, ?, ?)', [day.getDate(),day.getMonth()+1,day.getFullYear(), task,habitId,day.valueOf()]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  addHabit(habit) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {

          tx.executeSql('INSERT INTO Habit ("habitName", "icon", "unit", "startValue", "rateValue", "rateDays", "startDay", "startMonth", "startYear", "currentReward", "currentDayUntilReward", "timestamp") VALUES (?, ?, ?, ?, ?,?,?, ?, ?, ?, ?,?)',[habit.habitName, habit.icon, habit.unit, habit.startValue, habit.rateValue, habit.rateDays, habit.startDay, habit.startMonth, habit.startYear, habit.currentReward, habit.currentDayUntilReward, habit.timestamp]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    }); 
    
    


    
  }

  updateHabit(habit) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {

          


          tx.executeSql('UPDATE Habit SET habitName = ?, icon = ?, unit = ?, startValue = ?, rateValue = ?, rateDays = ?,  currentReward = ?, currentDayUntilReward = ? WHERE habitId= ?',[habit.habitName, habit.icon, habit.unit, habit.startValue, habit.rateValue, habit.rateDays, habit.currentReward, habit.currentDayUntilReward,id]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  updateUserAccess(today) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE User SET lastAccess = ?',[today.valueOf()]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  updateDayStatus(status, date,habitId) {
    let day=new Date(date);
    console.log(day)
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE Day SET status = ? WHERE day= ? and month=? and year=? and habitId=?',[status,day.getDate(),day.getMonth()+1,day.getFullYear(),habitId]).then(([tx, results]) => {
            resolve(results);
          });
          
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  updateDayTask(task, date, habitId) {
    let day=new Date(date);
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE Day SET task = ? WHERE day= ? and month=? and year=? and habitId=?',[task,day.getDate(),day.getMonth()+1,day.getFullYear(),habitId]).then(([tx, results]) => {
            resolve(results);
          });
          
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  updateProduct(id, prod) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE Product SET prodName = ?, prodDesc = ?, prodImage = ?, prodPrice = ? WHERE prodId = ?', [prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice, id]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  deleteProduct(id) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM Product WHERE prodId = ?', [id]).then(([tx, results]) => {
            console.log(results);
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }


  getUser() {
    console.log("I'0m getting the user infoi");
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
         // tx.executeSql('SELECT * FROM User,Avatars WHERE avatarId = currentAvatarId Or 1', []).then(([tx,results]) => {
         tx.executeSql('SELECT * FROM User', []).then(([tx,results]) => {

         console.log(results);
            if(results.rows.length > 0) {
              let row = results.rows.item(0);
              resolve(row);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }
}
