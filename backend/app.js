var express=require("express");
var mongoose =require("mongoose");
var cors = require('cors')
var bodyParser = require('body-parser')

// var adminCtrl = require("./controllers/adminCtrl.js");
// var adminStudentCtrl = require("./controllers/adminStudentCtrl.js");
// var adminCourseCtrl = require("./controllers/adminCourseCtrl.js");
var mainCtrl = require("./controllers/mainCtrl.js");

var app=express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/NDT',{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
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



app.use(express.static("public"));

app.use(function(req,res){
    res.send("404 page not found..");
});


app.listen(3000);
console.log("server is running on port 3000..");