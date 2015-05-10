//logger
var fs = require('fs.extra'),
	path = require('path'),
	filendir = require('filendir'),
	DIR_LOG = path.join(__dirname, 'logs'), //default
  quietMode = false;

//TODO make async
exports.err = function (message) {
  
	var fileLog = path.join(DIR_LOG, 'error.log');
  if(!quietMode){
    console.error(message);
  }
  fs.createFileSync(fileLog); //make sure log file exists
  fs.appendFileSync(fileLog, getDateTime() + " - " + message + "\r\n");
}

//TODO make async
exports.msg = function(message) {
	var fileLog = path.join(DIR_LOG, 'message.log');
  if(!quietMode){
    console.log(message);
  }
  fs.createFileSync(fileLog); //make sure log file exists
	fs.appendFileSync(fileLog, getDateTime() + " - " + message + "\r\n");
}

exports.setDirLog = function(path) {
	DIR_LOG = path;
}

exports.getDirLog = function() {
	return DIR_LOG;
}

exports.quietMode = function(mode){
  quietMode = mode;
}

function getDateTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}
