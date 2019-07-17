const express = require('express')
const bodyParser= require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://goldfish_test:goldfish@cluster0-7zhxb.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

var db

client.connect(err => {
    if (err) return console.log(err)
        db = client.db('goldfish_test') // whatever your database name is
        app.listen(3000, () => {
            console.log('listening on 3000')
        })
    //const collection = client.db("goldfish_test").collection("users");
    //client.close();
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
  })

app.post('/registerSubscriber', (req, res) => {
    db.collection('subscribers').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      })
})

app.post('/receiveSMS', (req, res) => {
    db.collection('incoming_msgs').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      })
})