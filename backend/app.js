var express=require("express");
var mongoose =require("mongoose");
var cors = require('cors')
var bodyParser = require('body-parser')
var fs = require('fs');
var http = require('http');
var https = require('https');

// var adminCtrl = require("./controllers/adminCtrl.js");
// var adminStudentCtrl = require("./controllers/adminStudentCtrl.js");
// var adminCourseCtrl = require("./controllers/adminCourseCtrl.js");
var mainCtrl = require("./controllers/mainCtrl.js");
var ndt_Pores = require("./controllers/ndt_Pores.js");
var ServerConfig = require('./ServerConfig')

var mongoConnection=ServerConfig.MongoConnectionString;

var privateKey  = fs.readFileSync('./certificate/private.key','utf8');
var certificate = fs.readFileSync('./certificate/mydomain.crt','utf8');
var credentials = {key: privateKey, cert: certificate};

var app=express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(mongoConnection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect("mongodb+srv://binny_01:binny01@cluster0-ziirr.gcp.mongodb.net/EventManagementSystem?retryWrites=true&w=majority");
// mongoose.connect('mongodb://192.168.0.54/EventManagementSystem');


app.get ("/model",                     mainCtrl.showIndex);
// app.get("/sendemail",                  mainCtrl.sendEmail)
app.post("/model",                     mainCtrl.doAddModel)
app.put("/model/:mid",                 mainCtrl.doEditModel)
app.delete("/model/:mid",              mainCtrl.doDeleteModel)
app.get("/model/:mid",                 mainCtrl.getModelDetail)
// app.post("/checkin",                   mainCtrl.checkin)
app.post("/model/train/:mid",          mainCtrl.doTrainModel)
app.post("/model/predict/:mid",        mainCtrl.doPredictModel)
app.get("/model/trainResult/:mid",     mainCtrl.getTrainResult)
app.get("/model/H5/:mid",              mainCtrl.getH5)

app.post("/testssh",                   ndt_Pores.testssh)


app.use(express.static("public"));

app.use(function(req,res){
    res.send("404 page not found..");
});


// app.listen(3000);
// console.log("server is running on port 3000..");

httpServer.listen(3000, function() {
    console.log('HTTP Server is running on: http://localhost:3000');
});
httpsServer.listen(3001, function() {
    console.log('HTTPS Server is running on: https://localhost:3001');
});

