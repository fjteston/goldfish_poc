const express = require('express')
const bodyParser= require('body-parser')
const app = express()

//app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://goldfish_test:goldfish@cluster0-7zhxb.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const appID = "4p4yC87Baetq5Tdx5piBnLtKGpeKCnzB"
const appSecret = "a29138bf78bdb2487d54e131fefa81530f8b243318eb702cfeebbd20b988fa4b"

var code
var request = require('request')
var db

client.connect(err => {
    if (err) return console.log(err)
        db = client.db('goldfish_test')
        app.listen(3000, () => {
            console.log('listening on 3000')
        })
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

//RECEIVE UNSUBSCRIBED USERS HERE
app.post('/registerSubscriber', (req, res) => {
    var body = req.body
    var subscriberData = {
        access_token: body.access_token,
        subscriber_number: body.subscriber_number
    }
    db.collection('subscribers').insertOne(subscriberData, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.sendStatus(200)
    })
})
//RECEIVE UNSUBSCRIBED USERS HERE

//START SUBSCRIPTIOM
app.get('/registerSubscriber', (req, res) => {

    if(req.query.access_token == undefined && req.query.subscriber_number == undefined){
        if(req.query.code != undefined) {
            var jsonData = { "code": req.query.code,
            "app_id": appID,
            "app_secret": appSecret }

            request({
            url: "http://developer.globelabs.com.ph/oauth/access_token",
            method: "POST",
            json: true,
            body: jsonData
            }, function (err, response, body){
                if (err) return 
                var subscriberData = {
                    access_token: response.body.access_token,
                    subscriber_number: response.body.subscriber_number
                }
                db.collection('subscribers').insertOne(subscriberData, (err, result) => {
                    if (err) return console.log(err)
                    console.log('saved to database')
                    res.sendStatus(200)
                })
            });
        }
    }else {
        var subscriberData = {
            access_token: req.query.access_token,
            subscriber_number: req.query.subscriber_number
        }
        db.collection('subscribers').insertOne(subscriberData, (err, result) => {
            if (err) return console.log(err)
            console.log('saved to database')
            res.sendStatus(200)
        })
    }
})
//END SUBCRIPTION

//START RECEIVE SMS
app.post('/receiveSMS', (req, res) => {

    var msgs = req.body.inboundSMSMessageList.inboundSMSMessage

    for(var x=0; x<msgs.length; x++){
        var msg = msgs[x]
        saveMsg(msg)
        if(x==msgs.length-1){
            res.sendStatus(200)
        }
    }
    
})

function saveMsg(msgData) {
    var msg = msgData.message.toUpperCase(); 
    var location = ""
    var location2 = ""
    var needHelp = ""
    if(msg.match(/RCVD.*NEED?\sHELP.*/g)){
        var rxHelp = msg.match(/NEED?\sHELP?:?\s*/g);
        var parsedString = msg.split(rxHelp);
        var rxLoc = parsedString[0].match(/RCVD?\s*/g);
        needHelp = parsedString[1];
        location = parsedString[0].replace(rxLoc, "");
        var rxOther = location.match(/OTHER?\s*/)
        if(rxOther){
            location2 = location.replace(rxOther, "")
            location = "OTHER"
        }
    }

    var msgJSON = {
        fullMessage: msgData.message,
        location: location,
        location2: location2,
        needHelp: needHelp,
        senderAddress: msgData.senderAddress,
        destinationAddress: msgData.destinationAddress,
        dateTime: msgData.dateTime
    }
    db.collection('incoming_msgs').insertOne(msgJSON, (err, result) => {
        if (err) return console.log(err)
        console.log('Message saved to database')
    })
}
//END RECEIVE SMS
