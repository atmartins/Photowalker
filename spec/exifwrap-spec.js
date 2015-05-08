// spec/exifwrap-spec.js
var path = require('path'),
    exifwrap = require(path.join('..', 'lib', 'exif-wrap.js')),
    dir_pictures = path.join(__dirname, 'test_pictures');

describe("exif-wrap module", function () {

  it("should read exif data from a test image and return it as an Object", function () {
    var exifJson = exifwrap.getExif(path.join(dir_pictures, 'from_robins_phone.JPG'));
    expect(exifJson)
      .toEqual(jasmine.any(Object));
    expect(exifJson.FileSize)
      .toBeDefined();
    expect(exifJson.FileSize)
      .toBe('1418 kB');
  });

  it("should read exif data from a test video and return it as an Object", function () {
    var exifJson = exifwrap.getExif(path.join(dir_pictures, 'movie.mp4'));
    expect(exifJson)
      .toEqual(jasmine.any(Object));
    expect(exifJson.FileSize)
      .toBeDefined();
  });

  it("should convert non-standard date string to standard date string", function () {
    expect(exifwrap.dateToStandard("2014:12:24 22:00:25"))
    	.toBe("2014-12-24 22:00:25");
  });

});
