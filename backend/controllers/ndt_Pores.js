var ServerConfig = require('../ServerConfig')
var Client = require('ssh2').Client;
let SFTPClient = require('ssh2-sftp-client');

var modelServerConfig = ServerConfig.ModelServerConfig;
var serverInfo = null;
var ssh_config;


function getModelServerInfo(modelId) {
  serverInfo = null;
  for (var i = 0; i < modelServerConfig.length; i++) {
    if (modelServerConfig[i].modelId == modelId) {
      ssh_config = {
        host: modelServerConfig[i].serverIP,
        port: modelServerConfig[i].port,
        username: modelServerConfig[i].username,
        password: modelServerConfig[i].password,
      }
      serverInfo = modelServerConfig[i];
      console.log("get ssh config file done>>>>>>>>>>>>")
    }
  }
}

exports.trainModel = function (modelId, timeStampId, parameters, callback) {
  var conn = new Client();
  var sftp = new SFTPClient();
  getModelServerInfo(modelId);

  var paramString_train = getParamsString(modelId, parameters, "train")

  sftp.connect(ssh_config).then(() => {
    return sftp.mkdir(serverInfo.fileUpladPath_train + timeStampId + "_Images", true)
  }).then((res) => {
    console.log(res);
    return sftp.mkdir(serverInfo.fileUpladPath_train + timeStampId + "_Masks", true)
  }).then((res) => {
    console.log(res);
    return sftp.uploadDir('D:\\NDT\\backend\\uploads\\' + modelId + '\\Train_' + timeStampId + '\\file1', serverInfo.fileUpladPath_train + timeStampId + "_Images");
  }).then((res) => {
    console.log(res);
    return sftp.uploadDir('D:\\NDT\\backend\\uploads\\' + modelId + '\\Train_' + timeStampId + '\\file2', serverInfo.fileUpladPath_train + timeStampId + "_Masks");
  }).then((res) => {
    console.log(res);
    console.log("all the files uploaded successful..")
    conn.connect(ssh_config)
  }).catch(err => {
    console.log("sftp catched errors:")
    console.log(err)
    callback("sftp connection error")
  })
  sftp.on('upload', info => {
    console.log(`Listener: Uploaded ${info.source}`);
  })
  sftp.on('close', function () {
    console.log("sftp connetion closing...");
  })
  sftp.on("error", function (err) {
    console.log("=============sftp connection error==============")
    console.log(err)
    conn.end();
  });
  //*************************** Execute Python ******************************* */
  conn.on('ready', function () {
    console.log('Client :: ready');
    var cmd = "cd " + serverInfo.workDir + "; /home/wanglong/anaconda3/bin/python UNet_training.py " + timeStampId + " " + paramString_train + " > train_out.txt 2>&1";
    console.log(cmd)
    conn.exec('dir', function (err, stream) {
      // conn.exec(cmd, function (err, stream) {
      if (err) throw err;
      stream.on('close', function (code, signal) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);

      }).on('data', function (data) {
        console.log('STDOUT: ' + data);
        callback("ok")
        conn.end();
        sftp.end();
      }).stderr.on('data', function (data) {
        console.log('STDERR: ' + data);
      });
    });
  });
  conn.on("error", function (err) {
    console.log("=============ssh connection error==============")
    console.log(err)
    conn.end();
  });
  conn.on('close', function () {
    console.log("ssh connection close...")
  })

}


function getParamsString(modelId, parameters, trainOrPredict) {
  getModelServerInfo(modelId);
  var params;
  if (trainOrPredict == "train") {
    params = serverInfo.paramString_train
  } else {
    params = serverInfo.paramString_predict
  }

  var finalString = "";
  for (var i = 0; i < params.length; i++) {
    for (var j = 0; j < parameters.length; j++) {
      if (parameters[j].name == params[i]) {
        if (parameters[j].type == "CheckBox") {
          parameters[j].answer.forEach(element => {
            finalString = finalString + element + " ";
          });
        } else {
          finalString = finalString + parameters[j].answer + " ";
        }
        break;
      }
    }
  }
  return finalString;
}

exports.predict = function (modelId, timeStampId, parameters, callback) {
  var conn = new Client();
  var sftp = new SFTPClient();
  getModelServerInfo(modelId);

  var paramString_predict = getParamsString(modelId, parameters, "predict")

  sftp.connect(ssh_config).then(() => {
    //*******for windows *********/
    // return sftp.mkdir(serverInfo.fileUpladPath_predict + timeStampId + "\\Images", true);

    //*******for ubuntu *********/
    return sftp.mkdir(serverInfo.fileUpladPath_predict + timeStampId + "/Images", true)

  }).then((res) => {
    console.log(res);
    //*******for windows *********/
    // return sftp.mkdir(serverInfo.predictResultPath + timeStampId + "\\Images", true);

    //*******for ubuntu *********/
    return sftp.mkdir(serverInfo.predictResultPath + timeStampId + "/Images", true);

  }).then((res) => {
    console.log(res);
    //*******for windows *********/
    // return sftp.uploadDir('D:\\NDT\\backend\\uploads\\' + modelId + '\\Predict_' + timeStampId + '\\file1', serverInfo.fileUpladPath_predict + timeStampId + "\\Images");

    //*******for ubuntu *********/
    return sftp.uploadDir('D:\\NDT\\backend\\uploads\\' + modelId + '\\Predict_' + timeStampId + '\\file1', serverInfo.fileUpladPath_predict + timeStampId + "/Images");

  }).then((res) => {
    console.log(res);
    console.log("all the files uploaded successful..")
    conn.connect(ssh_config)
  }).catch(err => {
    console.log("sftp catched errors:")
    console.log(err)
    callback("sftp connection error")
  })
  sftp.on('upload', info => {
    console.log(`Listener: Uploaded ${info.source}`);
  })
  sftp.on('close', function () {
    console.log("sftp connetion closing...");
  })
  sftp.on("error", function (err) {
    console.log("=============sftp connection error==============")
    console.log(err)
    conn.end();
  });

  //*************************** Execute Python ******************************* */
  conn.on('ready', function () {
    console.log('Client :: ready');
    var cmd = "cd " + serverInfo.workDir + "; /home/wanglong/anaconda3/bin/python segmentation_pores_UNet_24Dec2019.py " + timeStampId + " " + paramString_predict;
    console.log(cmd)
    //*******for windows *********/
    // conn.exec('dir', function (err, stream) {
    //*******for ubuntu *********/
    conn.exec(cmd, function (err, stream) {
      if (err) throw err;
      stream.on('close', function (code, signal) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        callback("ok")
        conn.end();
        sftp.end();
      }).on('data', function (data) {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', function (data) {
        console.log('STDERR: ' + data);
      });
    });
  });
  conn.on("error", function (err) {
    console.log("=============ssh connection error==============")
    console.log(err)
    conn.end();
  });
  conn.on('close', function () {
    console.log("ssh connection close...")
  })

}

exports.getH5 = function (modelId, callback) {
  console.log("============= Get H5 files ================")
  var conn = new Client();
  getModelServerInfo(modelId);
  var h5List = "";
  conn.connect(ssh_config);
  conn.on('ready', function () {
    console.log('Client :: ready');
    //*******for windows *********/
    // conn.exec('cd /d ' + serverInfo.H5Path + ' && dir /b *.h5', function (err, stream) {
    //*******for ubuntu *********/
    conn.exec('cd ' + serverInfo.H5Path + ';ls *.h5', function (err, stream) {
      if (err) throw err;
      stream.on('close', function (code, signal) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function (data) {
        console.log('STDOUT: ' + data);
        h5List = h5List + data;
      }).stderr.on('data', function (data) {
        console.log('STDERR: ' + data);
      });
    });
  });
  conn.on("error", function (err) {
    console.log("=============ssh connection error==============")
    console.log(err)
    conn.end();
  });
  conn.on('close', function () {
    console.log("ssh connection close...")
    callback(h5List);
  })
}

exports.getTrainResult = function (modelId, callback) {
  console.log("============= Get Training Output ================")
  var conn = new Client();
  getModelServerInfo(modelId);
  var output = "";
  conn.connect(ssh_config);
  conn.on('ready', function () {
    console.log('Client :: ready');
    //*******for windows *********/
    //conn.exec('cd /d ' + serverInfo.workDir + ' && type train_out.txt', function (err, stream) {
    //*******for ubuntu *********/
    conn.exec('cd ' + serverInfo.workDir + ';cat train_out.txt', function (err, stream) {
      if (err) throw err;
      stream.on('close', function (code, signal) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function (data) {
        // console.log('STDOUT: ' + data);
        output = output + data;
      }).stderr.on('data', function (data) {
        console.log('STDERR: ' + data);
      });
    });
  });
  conn.on("error", function (err) {
    console.log("=============ssh connection error==============")
    console.log(err)
    conn.end();
  });
  conn.on('close', function () {
    console.log("ssh connection close...")
    callback(output);
  })
}


exports.getPredictResult = function (modelId, timeStampId, callback) {
  var conn = new Client();
  var sftp = new SFTPClient();
  getModelServerInfo(modelId);

  sftp.connect(ssh_config).then(() => {
    //*******for windows *********/
    // return sftp.downloadDir(serverInfo.predictResultPath + timeStampId + "\\Images",'D:\\NDT\\backend\\uploads\\' + modelId + '\\Result_' + timeStampId);
    //*******for ubuntu *********/
    return sftp.downloadDir(serverInfo.predictResultPath + timeStampId + "/Images", 'D:\\NDT\\backend\\uploads\\' + modelId + '\\Result_' + timeStampId);
  }).then((res) => {
    console.log(res);
    console.log("all the result files downloaded successful..")
    callback("ok")
  }).catch(err => {
    console.log("sftp catched errors:")
    console.log(err)
    callback("sftp connection error")
  })
  sftp.on('download', info => {
    console.log(`Listener: Download ${info.source}`);
  })
  sftp.on('close', function () {
    console.log("sftp connetion closing...");
  })
  sftp.on("error", function (err) {
    console.log("=============sftp connection error==============")
    console.log(err)
    conn.end();
  });



}





exports.testssh = function (req, result) {
  var sftp = new SFTPClient();
  getModelServerInfo("5e8add664840065c3c09e8d1");
  sftp.connect(ssh_config).then(() => {
    return sftp.mkdir("/home/wanglong/mytest_Images", true)
  }).then((res) => {
    console.log(res);
    let rslt2 = sftp.uploadDir('D:\\NDT\\backend\\uploads\\5e8add664840065c3c09e8d1\\Train_1588934665455\\file1', "/home/wanglong/mytest_Images");
    return rslt2;
  }).then((res) => {
    console.log(res);
    console.log("create new path ok....")
    result.json({ "results": -1 });
    sftp.end();
  }).catch(err => {
    console.log("catch error:")
    console.log(err)
  })
  sftp.on('close', function () {
    console.log("****************sftp connetion closing*********************");
  })
  sftp.on("error", function (err) {
    console.log("=============sftp connection error==============")
    console.log(err)
    sftp.end();
  });
  sftp.on('upload', info => {
    console.log(`Listener: Uploaded ${info.source}`);
  })

}