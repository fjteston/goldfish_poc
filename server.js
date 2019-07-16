const express = require("express")
const app = express()
app.get("/", function(req, res) {
    res.send("Hello Worlds")
})

app.get("/test", function(req, res) {
    res.send("This is a test")
})
app.listen(3000)