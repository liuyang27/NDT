var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    Email: String,
    Mobiles: Array,
    Name: String,
    Website: Array,
    Image_base64: String,
    Rawstring: String,
    Timestamp: Date,
    Events: Array,
    Company:String,
});

var User = mongoose.model("User", userSchema, "User_Table");

module.exports = User;


// var userEvents = mongoose.model('User_Event_Info_Table', {
//     EventId: String,
//     UserId: String,
//     PreEventSurvey: Array,
//     PostEventSurvey: Array,
// }, "User_Event_Info_Table")