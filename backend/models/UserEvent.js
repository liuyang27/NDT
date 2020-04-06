var mongoose = require('mongoose');

var userEventSchema = new mongoose.Schema({
    EventId: String,
    UserId: String,
    PreEventSurvey: Array,
    PostEventSurvey: Array,
    Attendance: Array,
});


userEventSchema.statics.validationCheck = function (eid, qrcode, callback) {
    UserEvent.find({ "_id": qrcode, "EventId": eid }, function (err, results) {
        if (err) {
            callback({code:-1,user:null}); //qrcode invalid
            return;
        }
        if (results.length == 0) {
            callback({code:-2,user:null}); //eventId invalid
            return;
        }
        if (results[0].Attendance.length > 0) {
            callback({code:2,user:results});
            return;
        }
        else {
            callback({code:1,user:results});  //first time checkin
            return;
        }
    })
}


var UserEvent = mongoose.model("UserEvent", userEventSchema, "User_Event_Info_Table");

module.exports = UserEvent;