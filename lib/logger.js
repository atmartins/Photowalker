//logger
var fs = require('fs'),
	path = require('path'),
	filendir = require('filendir'),
	DIR_LOG = path.join(__dirname, 'logs'); //default

exports.err = function (message, options) {
  if(!options){
    options = {};
  }
	var fileLog = path.join(DIR_LOG, 'error.log');
  if(!options.quiet){
    console.error(message);
  }
	return filendir.ws(fileLog, getDateTime() + " - " + message + "\r\n"); //returns boolean
}

exports.msg = function(message, options) {
  if(!options){
    options = {};
  }
	var fileLog = path.join(DIR_LOG, 'message.log');
  if(!options.quiet){
    console.log(message);
  }
	return filendir.ws(fileLog, getDateTime() + " - " + message + "\r\n"); //returns boolean	
}

exports.setDirLog = function(path) {
	DIR_LOG = path;
}

exports.getDirLog = function() {
	return DIR_LOG;
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
