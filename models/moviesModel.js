var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var movieSchema  = new Schema({
    "name" : String,
    "language" : String,
    "year_released": Number
});
module.exports = mongoose.model('movies',movieSchema);
