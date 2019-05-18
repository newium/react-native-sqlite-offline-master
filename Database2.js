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




                    tx.executeSql('CREATE TABLE IF NOT EXISTS Product (prodId, prodName, prodDesc, prodImage, prodPrice)');

                    tx.executeSql('CREATE TABLE IF NOT EXISTS Avatar (avatarId, avatarName, avatarDesc, avatarPrice, avatarCurrentHealth,avatarMaximumHealth)');









                    
                  }).then(() => {
                      console.log("Table created successfully");
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

  addDay(habit, habitID) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO Day ("day", "month", "year","status","locked","task","habitId") VALUES (?, ?, ?, ?, ?, ?, ?)', [habit.startDay, habit.startMonth, habit.startYear, 'none', 0,habit.startValue+' '+habit.unit,habitID]).then(([tx, results]) => {
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

          


          tx.executeSql('INSERT INTO Habit ("habitName", "icon", "unit", "startValue", "rateValue", "rateDays", "startDay", "startMonth", "startYear", "currentReward", "currentDayUntilReward") VALUES (?, ?, ?, ?, ?,?,?, ?, ?, ?, ?)',[habit.habitName, habit.icon, habit.unit, habit.startValue, habit.rateValue, habit.rateDays, habit.startDay, habit.startMonth, habit.startYear, habit.currentReward, habit.currentDayUntilReward]).then(([tx, results]) => {
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
}
