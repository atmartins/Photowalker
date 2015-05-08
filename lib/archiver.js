//helps archive images and videos to the proper spot
var path = require('path'),
	logger = require(path.join(__dirname,'logger.js')),
	moment = require('moment'), //date parse help
	exifwrap = require(path.join(__dirname,'exif-wrap.js')),
	DIR_BASE = undefined;


exports.archive = function(imagePath) {

}

/**
 * Produce the correct archive path for an image with valid exif data.
 *
 * @param  {string} dateStr  Standard date string like "2014-12-24 22:00:25"
 * @param  {string} fileName The file's name, to be added to the end of the path.
 * @return {string}          file path
 */
exports.getArchivePath = function(imagePath) {
	if(!DIR_BASE){
		logger.err('Please define DIR_BASE before calling getArchivePath in ' + path.join(__dirname, 'archiver.js'));
	}

	var exifJson = exifwrap.getExif(imagePath);

	if(!exifJson){
		logger.err('No exifJson');
	}

	if(exifJson.DateTimeOriginal){
		var imageDate = exifJson.DateTimeOriginal;
	} else if (exifJson.ModifyDate) {
		var imageDate = exifJson.ModifyDate;
	} else {
		logger.err('Couldn\'t find date for photo ' + imagePath);
		return;
	}

	imageDate = moment(exifwrap.dateToStandard(imageDate));

	var archivePath = path.join(DIR_BASE, imageDate.year() + "", imageDate.month() + "", imageDate.day() + "", exifJson.FileName);
	return archivePath;
}

exports.setBaseArchivePath = function(path) {
	DIR_BASE = path;
}
