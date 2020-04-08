var mongoose = require('mongoose');


var modelSchema=new mongoose.Schema({
	name:String,
    type:String,
    about:String,
    author:String,
    remarks:String,
    modelEnable:Boolean,
    createdDate:Date,
    trainingInputs:Array,
    predictInputs:Array,
});


var CNN_Model=mongoose.model("CNN_Model",modelSchema,"CNN_Model_Table");

module.exports=CNN_Model;