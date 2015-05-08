// exifwrap.js
var sh = require('shelljs');

/**
 * Return JSON exif data for an image.
 *
 * @param  {string} imagePath Full or relative path to image.
 * @return {Object}           Exif data
 */
exports.getExif = function (imagePath) {
	var exifCmd = 'exiftool -json "' + imagePath + '"';
	var exifStr = sh.exec(exifCmd, {silent:true}).output;
	var exif = JSON.parse(exifStr);
	exif = exif[0]; //exiftool returns an array length 1 it seems
	return exif;
};

/**
 * Convert obscure exif date string to standard.
 * Expects date string from exiftool like "2014:12:24 22:00:25"
 *
 * @return {string} standard date string like "2014-12-24 22:00:25"
 */
exports.dateToStandard = function (str) {
	str = str.split(' ');
	str[0] = str[0].replace(/:/g, '-'); //replace all : with -
	return str[0] + ' ' + str[1];
};
