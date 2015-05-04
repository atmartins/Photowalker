var fs = require('fs');
//var exec = require('child_process').exec;
var sh = require('shelljs');
var moment = require('moment'); //date parse help

var dir_pictures = __dirname + '/tests/test_pictures';

//Prefer "DateTimeOriginal" property, else "ModifyDate", else failed to import b/c unrecognized date
//"ModifyDate": "2014:12:24 22:00:25",
//"DateTimeOriginal": "2013:10:04 13:33:22",

fs.readdir(dir_pictures, function(err, files){
	if(err){
		_log(err);
	} else {
		for(var i = 0, len = files.length; i < len; i++){
			_log(i);
			var filepath = dir_pictures + '/' + files[i],
				exifCmd = 'exiftool -json "' + filepath + '"';
			var exifStr = sh.exec(exifCmd, {silent:true}).output;
			var exif = JSON.parse(exifStr);
			exif = exif[0]; //exiftool returns an array length 1 it seems
			processImage(filepath, exif);
		}	
	}
});

/**
 * Copy an image to the appropriate folder.
 * 
 * @param  string imagePath Path to the image file.
 * @param  object exifData
 * 
 * @return {[type]}      [description]
 */
function processImage(imagePath, exifData) {
	if(!exifData){
		_err('No exifData');
	}
	if(exifData.DateTimeOriginal){
		var imageDate = exifData.DateTimeOriginal;
	} else if (exifData.ModifyDate) {
		var imageDate = exifData.ModifyDate;
	} else {
		_err('Couldn\'t find date for photo ' + imagePath);
		return;
	}
	if(!moment(imageDate).isValid()){
		imageDate = convertToDate(imageDate);
		if(!moment(imageDate).isValid()){
			_err('Invalid imageDate ' + imageDate + imagePath);
			return;
		}
	}
	imageDate = moment(imageDate);

	_log('proceeding');
	_log('Year ' + imageDate.year())
	_log('Month ' + imageDate.month())
	_log('Day ' + imageDate.day())
}

/**
 * Expects date string from exiftool like "2014:12:24 22:00:25"
 * @return standard date string like "2014-12-24 22:00:25"
 */
function convertToDate(str){
	str = str.split(' ');
	str[0] = str[0].replace(':', '-');
	return str[0] + ' ' + str[1];
}

function _log(msg) {
	console.log(msg);
	//@TODO append to log file
}

function _err(msg) {
	console.error(msg);
	//@TODO append to error log here
}