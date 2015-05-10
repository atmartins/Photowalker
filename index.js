var path = require('path'),
    fs = require('fs.extra'),
    archiver = require(path.join(__dirname, 'lib', 'archiver.js')),
    logger = require(path.join(__dirname, 'lib', 'logger.js'));

var imagesPath = path.resolve(process.argv[2]),
		archivePath = path.resolve(process.argv[3]);

if(!fs.existsSync(imagesPath)){
	console.error("Images source directory doesn't exist: " + imagesPath);
	return;
} else if(!fs.existsSync(archivePath)) {
	console.error("Archive directory doesn't exist: " + archivePath);
	return;
} else {
	console.log("Importing " + imagesPath + " to " + archivePath)
}

logger.setDirLog(path.join(__dirname, 'log'));
archiver.setBaseArchivePath(archivePath);

var walker = fs.walk(imagesPath);

walker.on("file", function (root, stat, next) {
  var imagePath = path.join(root, stat.name);
  archiver.archive(imagePath, function(err, successMsg){
  		if(err){
  			logger.err(err);
  		}
  		if(successMsg){
  			logger.msg(successMsg);	
  		}
  		next();    
    }, {
      copy: true
    });
});
