// spec/archiver-spec.js
// Uses async tests, see readme at https://github.com/mhevery/jasmine-node
var path = require('path'),
    fs = require('fs.extra'),
    archiver = require(path.join('..', 'lib', 'archiver.js')),
    logger = require(path.join('..','lib', 'logger.js')),
    dir_pictures = path.join(__dirname, 'test_pictures'),
    dir_archive = path.join(__dirname, 'test_archive'),
    dir_testLog = path.join(__dirname, 'test_logs', 'archiver-spec');

var cleanup = true;
logger.quietMode(true);

describe("archiver module", function () {

  it("should return the proper save path for a given image", function () {
    expect(archiver.getArchivePath(path.join(dir_pictures, 'from_robins_phone.JPG')))
    	.toBe(path.join(dir_archive, "2014", "11", "3", "from_robins_phone.JPG"));
  });

  it("should return the proper save path (folder only) for a given image", function () {
    expect(archiver.getArchiveFolderPath(path.join(dir_pictures, 'from_robins_phone.JPG')))
      .toBe(path.join(dir_archive, "2014", "11", "3"));
  });

  it("should archive a given image in the correct spot", function (done) {
    var imagePath = path.join(dir_pictures, 'from_robins_phone.JPG');
    archiver.archive(imagePath, function(){
      done();
    }, {
      copy: true
    })
  });

  beforeEach(function(){
    archiver.setBaseArchivePath(dir_archive);
    logger.setDirLog(dir_testLog);
  });

  afterEach(function(){
    if(cleanup){
      fs.rmrf(dir_archive); //clean up test archive folder
      fs.rmrf(dir_testLog); //clean up test log folder  
    }
  });
});
