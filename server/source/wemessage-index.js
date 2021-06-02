const express = require('express');
const cors = require('cors')
const app = express()
const port = 3600
const mysql = require('mysql');
const db_conf = require('./db_conf.js');

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(cors())




app.get('/wemessage', (req, res) => {
    res.send('Hello World!')
})

app.get('/wemessage/info', (req, res) => {
    res.send({
        name: "zhaoolee",
        age: 25
    })
})

app.post('/wemessage/onLogin', (req, res) => {
    console.log(req);
    res.send({
        name: "zhaoolee",
        age: 25
    })
})

app.post('/wemessage/message', (req, res)=>{
    const { markdown_file_name, nick_name, message } = req.body

    

    var connection = mysql.createConnection(db_conf.db.online);
       
      connection.connect();
       
      connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
      });
       
      connection.end();
})


app.get('/wemessage/message', (req, res) => {


    res.json({
        status: 1000,
        message: "留言列表",
        data: [
            {
                name: "user1",
                text: "留言1"
            },
            {
                name: "user2",
                text: "留言2"
            },            
            {
                name: "user3",
                text: "留言3"
            },
            {
                name: "user4",
                text: "留言4"
            }

        ]
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log("==>>", db_conf.db.online);
})