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

exports.trainModel =  function (modelId, timeStampId,callback) {
  var conn = new Client();
  var sftp = new SFTPClient();
  getModelServerInfo(modelId);
  // console.log(ssh_config);

  sftp.connect(ssh_config).then(() => {
    return sftp.mkdir(serverInfo.fileUpladPath + timeStampId + "_Images", true)
  }).then((res) => {
    console.log(res);
    return sftp.mkdir(serverInfo.fileUpladPath + timeStampId + "_Masks", true)
  }).then((res) => {
    console.log(res);
    return sftp.uploadDir('D:\\NDT\\backend\\uploads\\'+modelId+'\\Train_' + timeStampId + '\\file1', serverInfo.fileUpladPath + timeStampId + "_Images");
  }).then((res) => {
    console.log(res);
    return sftp.uploadDir('D:\\NDT\\backend\\uploads\\'+modelId+'\\Train_' + timeStampId + '\\file2', serverInfo.fileUpladPath + timeStampId + "_Masks");
  }).then((res) => {
    console.log(res);
    console.log("all the files uploaded successful..")
    conn.connect(ssh_config)
  }).catch(err => {
    console.log("catch error:")
    console.log(err)
  })

  sftp.on('upload', info => {
    console.log(`Listener: Uploaded ${info.source}`);
  })
  sftp.on('close', function () {
    console.log("sftp connetion closing...");
    callback("ok")
  })
  sftp.on("error", function (err) {
    console.log("=============sftp connection error==============")
    console.log(err)
    conn.end();
  });




  //********************************************************** */
  // conn.connect(ssh_config);

  conn.on('ready', function () {
    console.log('Client :: ready');
    // conn.exec('cd /d D:\\NDT\\backend\\uploads\\5e8add664840065c3c09e8d1 && dir', function (err, stream) {
    conn.exec('dir', function (err, stream) {
      if (err) throw err;
      stream.on('close', function (code, signal) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
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
  //********************************************************** */



  // conn.on('ready', function() {
  //     console.log('Client :: ready');
  //     conn.shell(function(err, stream) {
  //       if (err) throw err;
  //       stream.on('close', function() {
  //         console.log('Stream :: close');
  //         conn.end();
  //       }).on('dir', function(data) {
  //         console.log('OUTPUT: ' + data);
  //       });
  //       stream.end('dir');
  //     });
  //   }).connect(ssh_config);



  // conn.on('ready',function (err,stream) {
  // console.log('Client :: ready');
  // if (err) throw err;

  // stream.on('close', function() {
  //   console.log('Stream :: close');
  //   conn.end();
  // }).on('data', function(data) {
  //   console.log('OUTPUT: ' + data);
  // });
  // stream.end('dir');


  // conn.exec('D:;cd D:\\NDT\\backend\\uploads\\5e8add664840065c3c09e8d1; dir >1.txt', function (err, stream) {
  //     if (err) throw err;
  //     stream.on('close', function (code, signal) {
  //         conn.end();
  //     }).on('data', function (data) {
  //         console.log('STDOUT: ' + data);
  //     }).stderr.on('data', function (data) {
  //         console.log('STDERR: ' + data);
  //     });
  // });
  // }).connect(ssh_config);

}

exports.predict = function (modelId, timeStampId) {

}

exports.getTrainResult = function(modelId,callback){
  console.log("============= Get Training Output ================")
  var conn = new Client();
  getModelServerInfo(modelId);
  var output="";
  conn.connect(ssh_config);
  conn.on('ready',function () {
    console.log('Client :: ready');
    conn.exec('cd /d '+serverInfo.workDir+' && type train_out1.txt',function (err, stream) {
      if (err) throw err;
      stream.on('close', function (code, signal) {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function (data) {
        console.log('STDOUT: ' + data);
        output=output+data;
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


exports.testssh = function(req,result){
  var sftp = new SFTPClient();
  getModelServerInfo("5e8add664840065c3c09e8d1");
  sftp.connect(ssh_config).then(() => {
    return sftp.mkdir("/home/wanglong/mytest_Images", true)
  }).then((res)=>{
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