const express = require('express');
const cors = require('cors')
const app = express()
const port = 3600
const mysql = require('mysql');
const db_conf = require('./db_conf.js');
const bodyParser = require('body-parser')
const axios = require('axios');
const schedule = require('node-schedule');

const url = require('url');
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

// 获取所有文章的url and post_id
async function get_link_and_id(host){

    let next = true;

    let link_and_id = {}

    let page = 1;

    while(next){

        let tmp_wp_data = (await axios({
            method: "get",
            url: host+"/wp-json/wp/v2/posts?per_page=100&page="+page
        }))["data"]


        tmp_wp_data.map((value)=>{
            link_and_id[value["link"]] = value["id"]
        })

        if(tmp_wp_data.length < 100){

            next = false;

        }else{
            page = page + 1
        }

    }

     global.link_and_id = {...global.link_and_id, ...link_and_id}

}

// 创建wp新评论

async function create_wp_comment(link, nick_name, message){

    console.log("==!!!==", Object.keys(global.link_and_id));

    const id = global.link_and_id[link];

    console.log("id==>", id, "link==>>", link);

    const link_info =  url.parse(link)

    const host = link_info.protocol + "//" + link_info.hostname

    const comments_data = await axios({
        method: "post",
        url: host+"/wp-json/wp/v2/comments",
        data: {
            author_name: nick_name,
            content: message,
            post: id

        }

    })

    console.log('comment_data===>>', comments_data)

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
            
            create_wp_comment(markdown_file_name, nick_name, message)


            resolve();
        });
        
    })

    res.json(respond_json)
})


app.get('/wemessage/message', async(req, res) => {



    const { markdown_file_name } = req.query;

    const connection = mysql.createConnection(db_conf.db.online);
    connection.connect();

    let select_message_sql = `select * from message where markdown_file_name = '${decodeURIComponent(markdown_file_name)}';`

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
                    message: "获取留言success",
                    data: results.reverse()
                }

               

            }

            connection.end();
            resolve();
        });
        
    })
    res.json(respond_json)

})

app.listen(port, async() => {

    global.link_and_id = {};

    await get_link_and_id("https://fangyuanxiaozhan.com");
    await get_link_and_id("https://v2fy.com");

    schedule.scheduleJob('*/5 * * * *', async()=>{
        await get_link_and_id("https://fangyuanxiaozhan.com");
        await get_link_and_id("https://v2fy.com");
    });
    
    console.log(`Example app listening at http://localhost:${port}`)
})