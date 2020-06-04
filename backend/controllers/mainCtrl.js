// var crypto = require('crypto');
// var _= require("underscore");
// var Course = require("../models/Course");

// var formidable = require('formidable'); // notes: form input need a name!!!!!!!


//------------------ignore above---------------------------
var CNN_Model = require("../models/CNN_Model");
var formidable = require('formidable');
// var UserEvent = require("../models/UserEvent");
// var User = require("../models/User");
var fs = require('fs');
// var modelServerConfig = require('../modelServerConfig')
var ndt_Pores = require("./ndt_Pores");
var ndt_Cracks = require("./ndt_Cracks");





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
}

exports.getEditModelDetail = function (req, res) {
  console.log("-----------GET Edit Model Detail--------------")
  var mid = req.params.mid;
  console.log("Model ID:" + mid)
  CNN_Model.find({ "_id": mid }, async function (err, results) {
    if (err || results.length == 0) {
      res.json({ "results": -1 });
      return;
    }
    res.json({ "results": results[0] });
  })
}


exports.getModelDetail = function (req, res) {
  console.log("-----------GET Model Detail--------------")
  var mid = req.params.mid;
  console.log("Model ID:" + mid)
  CNN_Model.find({ "_id": mid }, async function (err, results) {
    if (err || results.length == 0) {
      res.json({ "results": -1 });
      return;
    }

    //******************Get H5 for models***************** */
    if (mid == "5e8d94e200bc28e910a8a24a") {
      await ndt_Pores.getH5(mid, (data) => {
        if (data == "" || data.length == 0) {
          console.log("cannot find H5")
        } else {
          //**********for ubuntu************** */
          var h5 = data.split('\n');
          //**********for windows************** */
          // var h5=data.split('\r\n');

          h5=h5.slice(0, h5.length-1);
          console.log(h5)
          results[0].trainingInputs[6].options = h5
          results[0].predictInputs[1].options = h5
        }
        res.json({ "results": results[0] });
      })
    } else {
      console.log("No H5 files config")
      res.json({ "results": results[0] });
    }

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


exports.doTrainModel = function (req, res) {
  console.log("==============Train Model=================")
  var mid = req.params.mid;
  var form = new formidable.IncomingForm();
  form.uploadDir = "./uploads";
  form.keepExtensions = true;
  form.multiples = true;
  form.maxFileSize = 200 * 1024 * 1024; //total file max size = 200MB

  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.log("============== errors  =================")
      console.log(err)
      res.json({ "results": "Formidable form.parse error" });
      return;
    }
    if (JSON.stringify(files) == "{}") {
      console.log("No files uploaded...")
      res.json({ "results": "No file uploaded" });
      return;
    }

    try {
      inputsParameters = JSON.parse(fields.textInputs);
      parameters = inputsParameters["trainingInputs"]

      n = 1;
      timeStampId = new Date().getTime().toString();
      for (let i = 0; i < parameters.length; i++) {
        if (parameters[i].type == "File" && !fs.existsSync("./uploads/" + mid + "/Train_" + timeStampId + "/file" + n)) {
          fs.mkdirSync("./uploads/" + mid + "/Train_" + timeStampId + "/file" + n, { recursive: true })
          console.log("created new training folder" + n)
          n++;
        }
      }

      // console.log("==============rename and relocate uploaded files....=================")
      // console.log(files)
      n = 1;
      for (let i = 0; i < parameters.length; i++) {
        if (parameters[i].type == "File") {
          TrainingInputName = parameters[i].name
          if (Array.isArray(files[TrainingInputName])) {
            for (j = 0; j < files[TrainingInputName].length; j++) {
              oldPath = "./" + files[TrainingInputName][j].path
              newPath = "./uploads/" + mid + "/Train_" + timeStampId + "/file" + n + "/" + files[TrainingInputName][j].name
              fs.renameSync(oldPath, newPath);
            }
          } else {
            oldPath = "./" + files[TrainingInputName].path
            newPath = "./uploads/" + mid + "/Train_" + timeStampId + "/file" + n + "/" + files[TrainingInputName].name
            fs.renameSync(oldPath, newPath);
          }
          n++;
        }
      }
    } catch (error) {
      console.log("Submitted form data error..")
      res.json({ "results": "Submitted form data error" });
      return;
    }

    if (mid == "5e8d94e200bc28e910a8a24a") {
      await ndt_Pores.trainModel(mid, timeStampId, parameters, (data) => {
        if (data == "ok") {
          console.log("MainCtrl: start training ok")
          res.json({ "results": data });
        } else {
          console.log("MainCtrl: sftp connection error..")
          res.json({ "results": data });
        }
      });
    }
    else if (mid == "5e8add664840065c3c09e8d1") {
      console.log("go to model cracks>>>>>>>>>>>>>>>")
      res.json({ "results": "not config yet" });
      return;
    }
    else {
      res.json({ "results": "not config yet" });
      console.log(">>>>>>>>>>> model not config yet >>>>>>>>>>>")
      return;
    }


  });
}


exports.getTrainResult = async function (req, res) {
  var mid = req.params.mid;
  if (mid == "5e8d94e200bc28e910a8a24a") {
    await ndt_Pores.getTrainResult(mid, (data) => {
      res.json({ "results": data });
    });
  }
  else if (mid == "5e8add664840065c3c09e8d1") {
    res.json({ "results": "not config yet" });
    console.log(">>>>>>>>>>> model not config yet >>>>>>>>>>>")
  }
  else {
    res.json({ "results": "not config yet" });
    console.log(">>>>>>>>>>> model not config yet >>>>>>>>>>>")
    return;
  }

}



exports.doPredictModel = function (req, res) {
  console.log("==============Predict Model=================")
  var mid = req.params.mid;
  var form = new formidable.IncomingForm();
  form.uploadDir = "./uploads";
  form.keepExtensions = true;
  form.multiples = true;
  form.maxFileSize = 200 * 1024 * 1024; //total file max size = 200MB


  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.log("============== errors  =================")
      console.log(err)
      res.json({ "results": "Formidable form.parse error" });
      return;
    }
    if (JSON.stringify(files) == "{}") {
      console.log("No files uploaded...")
      res.json({ "results": "No file uploaded" });
      return;
    }
    try {
      inputsParameters = JSON.parse(fields.textInputs);
      parameters = inputsParameters["predictInputs"]

      n = 1;
      timeStampId = new Date().getTime().toString();
      for (let i = 0; i < parameters.length; i++) {
        if (parameters[i].type == "File" && !fs.existsSync("./uploads/" + mid + "/Predict_" + timeStampId + "/file" + n)) {
          fs.mkdirSync("./uploads/" + mid + "/Predict_" + timeStampId + "/file" + n, { recursive: true })
          console.log("created new predict folder" + n)
          n++;
        }
      }

      if (!fs.existsSync("./uploads/" + mid + "/Result_" + timeStampId)) {
        fs.mkdirSync("./uploads/" + mid + "/Result_" + timeStampId, { recursive: true })
        console.log("created new result folder" + n)
      }

      // console.log("==============rename and relocate uploaded files....=================")
      // console.log(files)
      n = 1;
      for (let i = 0; i < parameters.length; i++) {
        if (parameters[i].type == "File") {
          PredictInputName = parameters[i].name
          if (Array.isArray(files[PredictInputName])) {
            for (j = 0; j < files[PredictInputName].length; j++) {
              oldPath = "./" + files[PredictInputName][j].path
              newPath = "./uploads/" + mid + "/Predict_" + timeStampId + "/file" + n + "/" + files[PredictInputName][j].name
              fs.renameSync(oldPath, newPath);
            }
          } else {
            oldPath = "./" + files[PredictInputName].path
            newPath = "./uploads/" + mid + "/Predict_" + timeStampId + "/file" + n + "/" + files[PredictInputName].name
            fs.renameSync(oldPath, newPath);
          }
          n++;
        }
      }
    } catch (error) {
      console.log("Submitted form data error..")
      res.json({ "results": "Submitted form data error" });
      return;
    }

   if (mid == "5e8d94e200bc28e910a8a24a") {
      await ndt_Pores.predict(mid, timeStampId, parameters, (data) => {
        console.log("start predict ok")
        res.json({ "results": data, "timeStampId": timeStampId });
      });
    } else {
      console.log(">>>>>>>>>>> model not config yet >>>>>>>>>>>")
      res.json({ "results": "not config yet" });
      return;
    }
  });
}

exports.getPredictResult = async function (req, res) {
  var mid = req.params.mid;
  var timeStampId = req.params.timeStampId;

 if (mid == "5e8d94e200bc28e910a8a24a") {
    await ndt_Pores.getPredictResult(mid, timeStampId, (data) => {
      res.json({ "results": data });
      return;
    });
  }
  else if (mid == "5e8add664840065c3c09e8d1") {
    res.json({ "results": "not config yet" });
    console.log(">>>>>>>>>>> model not config yet >>>>>>>>>>>")
    return;
  }
  else {
    res.json({ "results": "not config yet" });
    console.log(">>>>>>>>>>> model not config yet >>>>>>>>>>>")
    return;
  }

}


exports.getH5 = async function (req, res) {
  var mid = req.params.mid;
  if (mid == "5e8d94e200bc28e910a8a24a") {
    await ndt_Pores.getH5(mid, (data) => {
      res.json({ "results": data });
    });
  }
  else if (mid == "5e8add664840065c3c09e8d1") {
    res.json({ "results": "not config yet" });
    console.log(">>>>>>>>>>> model not config yet >>>>>>>>>>>")
  }
  else {
    res.json({ "results": "not config yet" });
    console.log(">>>>>>>>>>> model not config yet >>>>>>>>>>>")
    return;
  }

}
