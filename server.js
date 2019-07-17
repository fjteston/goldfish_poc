const express = require('express')
const bodyParser= require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://goldfish_test:goldfish@cluster0-7zhxb.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const appID = "4p4yC87Baetq5Tdx5piBnLtKGpeKCnzB"
const appSecret = "a29138bf78bdb2487d54e131fefa81530f8b243318eb702cfeebbd20b988fa4b"
var code

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

app.post('/test', (req, res) => {
    db.collection('test').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})

//START REGISTER VIA SMS
app.post('/registerSubscriber', (req, res) => {
    db.collection('subscribers').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})
//END REGISTER VIA SMS

//START REGISTER VIA WEB FORM
app.get('/registerSubscriber', (req, res) => {

    //var json = JSON.parse(req.body); 
    db.collection('subscribers').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})

app.post('/getAccessToken', (req, res) => {
    db.collection('subscribers').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})
//END REGISTER VIA WEB FORM

//START RECEIVE SMS
app.post('/receiveSMS', (req, res) => {
    db.collection('incoming_msgs').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})
//END RECEIVE SMS
