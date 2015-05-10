//helps archive images and videos to the proper spot
var path = require('path'),
	fs = require('fs.extra'),
	moment = require('moment'), //date parse help
	logger = require(path.join(__dirname,'logger.js')),
	exifwrap = require(path.join(__dirname,'exif-wrap.js')),
	DIR_BASE = undefined;


function archive(imagePath, callback, options) {
	var archiveFolderPath = getArchiveFolderPath(imagePath)
		archivePath = getArchivePath(imagePath);
	if(!archivePath){
		var err = "Unable to acquire archivePath for " + imagePath;
		callback(err);
		return;
	}
	if(!archiveFolderPath){
		var err = "Unable to acquire archiveFolderPath for " + imagePath;
		callback(err);
		return;
	}
	fs.mkdirp(archiveFolderPath, function (err) {
        if(err){
        	var err = 'Unable to create archiveFolderPath: ' + archiveFolderPath;
        	callback(err);
        	return false;
        } else {
			var operation = 'move';
        	if(options && options.copy && options.copy === true){
				operation = 'copy';
        	}
		    fs[operation](imagePath, archivePath, function(err){
		    	if(err){
					callback(err + " " + imagePath, undefined);
		    	} else {
		    		var success = ('Moved ' + imagePath + ' to ' + archivePath);
		    		callback(undefined, success);
		    	}
			});
        }
    });
}

/**
 * Produce the correct archive folder path for an image with valid exif data.
 *
 * @param  {string} fileName The file's name.
 * @return {string}          archive folder path without file name
 */
function getArchiveFolderPath(imagePath) {
	if(!DIR_BASE){
		logger.err('Please define DIR_BASE before calling getArchiveFolderPath in ' + path.join(__dirname, 'archiver.js'));
		return;
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

	var archiveFolderPath = path.join(DIR_BASE, imageDate.year() + "", imageDate.month() + "", imageDate.day() + "");
	return archiveFolderPath;
}

/**
 * Produce the correct archive path for an image with valid exif data.
 *
 * @param  {string} fileName The file's name, to be added to the end of the path.
 * @return {string}          file path
 */
function getArchivePath(imagePath) {
	var exifJson = exifwrap.getExif(imagePath);

	if(!exifJson){
		logger.err('No exifJson');
	}
	var archiveFolderPath = getArchiveFolderPath(imagePath);

	if(!exifJson.FileName || !archiveFolderPath){
		return false;
	}
	var archivePath = path.join(archiveFolderPath, exifJson.FileName);
	return archivePath;
}

function setBaseArchivePath(path) {
	DIR_BASE = path;
}

//Export these functions
module.exports = {
	archive: archive,
	getArchivePath: getArchivePath,
	getArchiveFolderPath: getArchiveFolderPath,
	setBaseArchivePath: setBaseArchivePath
}
