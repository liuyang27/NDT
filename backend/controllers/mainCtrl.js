// var crypto = require('crypto');
// var _= require("underscore");
// var Course = require("../models/Course");

// var formidable = require('formidable'); // notes: form input need a name!!!!!!!


//------------------ignore above---------------------------
// const nodemailer = require("nodemailer");
var CNN_Model = require("../models/CNN_Model");
// var UserEvent = require("../models/UserEvent");
// var User = require("../models/User");
// const PDFDocument = require('pdfkit');
// var fs = require('fs');
// var QRCode = require('qrcode')
// var printer = require("pdf-to-printer");



// const mydict={
//     "1":"Year One",
//     "2":"Year Two",
//     "3":"Year Three",
// };
// exports.showIndex=function(req,res){
//     console.log("showIndex function...........")
//     Course.find({},function(err,results){
//         results = results.map(element =>({
//             "_id" : element._id, 
//             "allow" : element.allow.map(e =>  (e in mydict ) ? mydict[e]: "data err" ) , 
//             "cid" : element.cid, 
//             "name" : element.name, 
//             "dayofweek" : element.dayofweek, 
//             "number" : element.number, 
//             "teacher" : element.teacher, 
//             "briefintro" : element.briefintro, 
//             "__v" : element.__v
//         }) );
//         res.json({"results":results});  
// 	})
// }


exports.showIndex = function (req, res) {
  console.log("---------Get all CNN models-------------")
  CNN_Model.find({}, function (err, results) {
    results = results.map(element => ({
      "_id": element._id,
      "name": element.name,
      "type": element.type,
      "about": element.about,
      "author": element.author,
      "remarks": element.remarks,
      "modelEnable": element.modelEnable,
      "createdDate": element.createdDate,
      "trainingInputs": element.trainingInputs,
      "predictInputs": element.predictInputs,
      "__v": element.__v
    }));
    res.json({ "results": results });
  })
  // res.send("sssssss");
}



exports.getModelDetail = function (req, res) {
  console.log("-----------GET Model Detail--------------")
  var mid = req.params.mid;
  console.log("Model ID:" + mid)
  CNN_Model.find({ "_id": mid }, function (err, results) {
    if (err || results.length == 0) {
      res.json({ "results": -1 });
      return;
    }
    res.json({ "results": results[0] });

  })
}






exports.doAddModel = function (req, res) {
  console.log("------------------------ADD MODEL-----------------------------")
  console.log(req.body);
  var model = new CNN_Model(req.body);
  model.save(function (err) {
    if (err) {
      console.log(err);
      res.json({ "results": "-1" });
      return;
    }
    console.log("New model added successful");
    res.json({ "results": "1" });
  });
}


exports.doDeleteModel = function (req, res) {
  console.log("---------DELETE MODEL-----------")
  var mid = req.params.mid;
  CNN_Model.find({ "_id": mid }, function (err, results) {
    if (err || results.length == 0) {
      console.log("Cannot find the model with ID:" + mid)
      res.json({ "results": -1 });
      return;
    }
    results[0].remove(function (err) {
      if (err) {
        console.log("Cannot remove the model with ID:" + mid)
        res.json({ "results": -1 });
        return;
      }
      console.log("Model removed successful");
      res.json({ "results": 1 });
    })
  })
}



  exports.doEditModel = function (req, res) {
    console.log("------------------------Edit MODEL-----------------------------")
    var mid = req.params.mid;
    console.log("Model ID:" + mid)
    var body = req.body
    CNN_Model.findOneAndUpdate({ "_id": mid }, body, { new: true }, function (err, results) {

      if (err) {
        console.log(err)
        res.json({ "results": -1 });
        return;
      }
      console.log("Model edited successful")
      res.json({ "results": 1 });

    })

  }


  exports.checkin = function (req, res) {
    console.log("==============user check in=================")

    eid = req.body.eid;
    qrcode = req.body.qrcode;

    UserEvent.validationCheck(eid, qrcode, function (results) {

      if (results.code < 0) {
        console.log(results.code);
        res.json({ "results": results.code });

      } else {
        var d = new Date();
        UserEvent.findByIdAndUpdate(qrcode, { $push: { Attendance: d } }, function (err, response) {
          if (err) {
            console.log(results.code);
            res.json({ "results": -3 });     //update mongoDB fail 
            return;
          }

          User.findById(results.user[0].UserId, function (error, data) {
            if (error) {
              console.log(results.code);
              res.json({ "results": -3 });     //update mongoDB fail 
              return;
            }
            console.log(results.code);

            // console.log(data)
            if (!data) {
              res.json({ "results": -3 });
              return;
            }
            var qrCodeContent = {
              Name: data.Name,
              Company: data.Company,
              Email: data.Email,
              Mobiles: data.Mobiles
            }

            UserEvent.findById(qrcode, function (e, details) {
              console.log("--------------presurvey details---------")
              console.log(details.PreEventSurvey)

              res.json({ "results": results.code, "user": qrCodeContent, "PreEventSurvey": details.PreEventSurvey });   //check-in ok

            })
          })
        })
      }


    })

  }
