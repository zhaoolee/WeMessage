const express = require('express');
const cors = require('cors')
const app = express()
const port = 3600
const mysql = require('mysql');
const db_conf = require('./db_conf.js');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors())

//  随机产生字符串
function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz012345678",
      a = t.length,
      n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

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

app.post('/wemessage/message', async(req, res)=>{


    const { markdown_file_name, nick_name, message } = req.body

    const connection = mysql.createConnection(db_conf.db.online);
    connection.connect();
    const snow = String(Date.now()) + randomString(16)
    let insert_message_sql = `INSERT INTO message (snow, markdown_file_name, nick_name, message)VALUES 
    ('${snow}', '${markdown_file_name}', '${nick_name}', '${message}');`
    let respond_json = {
        status: 1000,
        message: "留言success"
    }

    await new Promise((resolve, reject)=>{

        connection.query(insert_message_sql, function (error, results, fields) {
            if (error) {
                throw error
                respond_json = {
                    status: 5100,
                    message: "留言失败",
                }
            }else{
                console.log('result==>>',results, 'fields==>>', fields);
            }

            connection.end();
            resolve();
        });
        
    })

    res.json(respond_json)
})


app.get('/wemessage/message', async(req, res) => {

    const { markdown_file_name } = req.body;

    const connection = mysql.createConnection(db_conf.db.online);
    connection.connect();

    let select_message_sql = `select * from message where markdown_file_name = '${markdown_file_name}';`

    console.log(select_message_sql);

    let respond_json = {
        status: 1000,
        message: "留言success",

    }

    await new Promise((resolve, reject)=>{

        connection.query(select_message_sql, function (error, results, fields) {
            if (error) {
                throw error
                respond_json = {
                    status: 5100,
                    message: "获取留言失败",
                }
            }else{
                console.log('result==>>',results, 'fields==>>', fields);
                respond_json = {
                    status: 1000,
                    message: "留言success",
                    data: results
                }

            }

            connection.end();
            resolve();
        });
        
    })
    res.json(respond_json)

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})