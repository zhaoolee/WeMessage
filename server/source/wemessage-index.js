const express = require('express');
var cors = require('cors')
const app = express()
const port = 3600


app.use(cors())



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/info', (req, res) => {
    res.send({
        name: "zhaoolee",
        age: 25
    })
})

app.get('/message', (req, res) => {





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
})