const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express")
const app = express();
const path = require("path")
const methodOverride=require("method-override")

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'DELTA_APP',
  password: 'lovemyself'
});

let getRandomuser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),

  ];
}

// let q = "INSERT INTO user(id,username,email,password) VALUES ?";

// let data = []
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomuser());

// }


// home page
app.get("/", (req, res) => {
  let q = `SELECT count(*) from user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"]
      res.render("home.ejs", { count })
    })

  }
  catch (err) {
    console.log(err)
    res.send("some error in DB")
  }

})

//Show route
app.get("/user", (req, res) => {
  let q = `SELECT * from user`
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users })
    })

  } catch (err) {
    console.log(err)
    res.send("some error in DB")
  }

})


// EDIt ROUTE
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params
  let q=`SELECT * FROM user where id='${id}'`

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user= result[0]
      res.render("edit.ejs", { user })
    })

  } catch (err) {
    console.log(err)
    res.send("some error in DB")
  }
 
})

// UPDATE ROUTE
app.patch("/user/:id",(req,res)=>{
  let { id } = req.params
  let {password:formPass , username:newUsername}=req.body
  let q=`SELECT * FROM user where id='${id}'`
    try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user= result[0]
      if(formPass!=user.password)
      {
        res.send("Wrong Password")
      }else{
        let q2=`UPDATE user SET username='${newUsername}'where id ='${id}'`
        connection.query(q2,(err,result)=>{
          if(err) throw err
          res.redirect("/user")
        })
      }
    })

  } catch (err) {
    console.log(err)
    res.send("some error in DB")
  }

})





app.listen("8080", () => {
  console.log("server is listening on port: 8080")
})





// connection.end();