// spec/archiver-spec.js
var path = require('path'),
    archiver = require(path.join('..', 'lib', 'archiver.js')),
    dir_pictures = path.join(__dirname, 'test_pictures'),
    dir_archive = path.join(__dirname, 'test_archive');

describe("archiver module", function () {

  it("should return the proper save path for a given image", function () {
    expect(archiver.getArchivePath(path.join(dir_pictures, 'from_robins_phone.JPG')))
    	.toBe(dir_archive + "/2014/11/3/from_robins_phone.JPG");
  });

  beforeEach(function(){
    archiver.setBaseArchivePath(dir_archive);
  });

});
