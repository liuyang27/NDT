var mongoose = require('mongoose');


var eventSchema=new mongoose.Schema({
	name:String,
	venue:String,
    capacity:Number,
    entryFee:Number,
    dateFrom:Date,
    dateTo:Date,
    timingFrom:String,
    timingTo:String,
    introduction:String,
    category:Array,
    organizer:String,
    eventformat:String,
    remarks:String,
    registrationEnable:Boolean,
    preEventSurvey:Array,
    postEventSurvey:Array
});

eventSchema.statics.addEvent=function(json,callback){
    var e = new Event(json);
    e.save(function(err){
        if(err){
            console.log('========================================================');
            console.log(err);
            console.log('========================================================');
            callback("-1");
            return;
        }
        callback("1");
    });
}

var Event=mongoose.model("Event",eventSchema,"Event_Table");

module.exports=Event;