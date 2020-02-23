import SQLite from "react-native-sqlite-storage"

SQLite.enablePromise(true)

const db_name = "expenses.db"
const db_version = "1.0"
const db_displayname = "Expenses"
const db_size = 2000

export default class Database {
  initDB = () => {
    let db
    return new Promise((resolve) => {
      SQLite.openDatabase({name: 'expenses.db', location: 'default'})
      .then((db)=> {
        db.executeSql('CREATE TABLE IF NOT EXISTS "expense_datas" ("id"	INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, "type"	TEXT NOT NULL, "amount"	NUMERIC NOT NULL, "info"	TEXT, "date" DATETIME NOT NULL)')
        .then(()=> { 
          console.log("expense_datas is now available!")
          resolve(db) })
        .catch((err)=>reject(err))
      })
    })
  }
  
  listExpense = (s,t,sd,ed) => {
    return new Promise((resolve) => {
      this.initDB().then((db)=> {
        db.transaction((tx) => {
          let a = (s != '0' && s != 'ALL')  ? s + " AS amount" : '*'
          let qtxt = `SELECT ${a} FROM expense_datas WHERE SUBSTR(date,1,10) BETWEEN '${sd}' AND '${ed}'`
          if (t != '0' && t != 'ALL') qtxt += ` AND type = '${t}'`
          tx.executeSql(qtxt)
          .then(([tx,res]) => {
            const es = []
            var len = res.rows.length
            if (a == '*') {
              es.push([1,3,3,3,3])
              es.push(['Id','Type','Amount','Info','Date'])
              for (let i = 0; i < len; i++) {
                let row = res.rows.item(i)
                const { id, type, amount, info, date  } = row
                es.push([
                  id,
                  type,
                  amount,
                  info,
                  date
                ])
              } 
            } else {
              es.push([1])
              es.push(['Amount'])
              let row = res.rows.item(0)
              const { amount  } = row
              es.push([
                amount
              ])
            }
            resolve(es)})
          .catch((err) => console.log(err))
        })
      })
    })
  }
  insertExpense = (expense) => {
    return new Promise((resolve) => {
      this.initDB().then((db)=> {
        db.transaction( (tx) => {
          tx.executeSql('INSERT INTO expense_datas ("type","amount","info","date") VALUES (?,?,?,datetime("now","localtime"))', [expense.type.value,expense.amount.value,expense.info.value])
          .then(([tx,res]) => {
            resolve(res)})
          .catch((err) => console.log(err))
        })
      })
    })
  }

  deleteExpense = (id) => {
    return new Promise((resolve) => {
      this.initDB().then((db)=> {
        db.transaction( (tx) => {
          tx.executeSql('DELETE FROM expense_datas WHERE id = ?', [parseInt(id)])
          .then(([tx,res]) => {
            resolve(res)})
          .catch((err) => console.log(err))
        })
      })
    })
  }
}