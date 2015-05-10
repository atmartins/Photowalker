// spec/logger-spec.js
var path = require('path'),
    fs = require('fs.extra'),
    sh = require('shelljs'),
    logger = require(path.join('..','lib', 'logger.js')),
    testDir = path.join(__dirname, 'test_logs'); //this is automatically removed after each test if cleanup is true

var cleanup = true;
logger.quietMode(true);

describe("logger module", function () {  
  
  it("should set the directory of the error log and get the same back.", function () {
    expect(logger.getDirLog()).toEqual(testDir);
  });

  //Test error logging
  it("should create the error log file and its directory structure, and write an error message to the file.", function () {
    var fileErrLog = path.join(testDir, 'error.log');
    var mockMsg = 'Spec dummy error message';
    logger.err(mockMsg);
    var contents = fs.readFileSync(fileErrLog,"utf8"); //read the error file
    expect(fs.existsSync(fileErrLog))
      .toBe(true);
    expect(contents)
      .toEqual(jasmine.any(String));
    expect(contents.length >= 1)
      .toBeTruthy();
    expect(contents.indexOf(mockMsg) > -1) //we should find our mock message in the error log somewhere
      .toBeTruthy();
  });

  //Test message logging
  it("should create the message log file and its directory structure, and write a message to the file.", function () {
    var fileErrLog = path.join(testDir, 'message.log');
    var mockMsg = 'Spec dummy message';
    logger.msg(mockMsg); //log an error
    var contents = fs.readFileSync(fileErrLog,"utf8"); //read the error file
    expect(fs.existsSync(fileErrLog))
      .toBe(true);    
    expect(contents)
      .toEqual(jasmine.any(String));
    expect(contents.length >= 1)
      .toBeTruthy();
    expect(contents.indexOf(mockMsg) > -1) //we should find our mock message in the error log somewhere
      .toBeTruthy();
  });

  //TODO - change to "beforeAll". Currently doesn't work (jasmine 2.0)
  beforeEach(function(){
    logger.setDirLog(testDir);
  });

  //TODO - change to "afterAll". Currently doesn't work (jasmine 2.0)
  afterEach(function() {
    if(cleanup){
      fs.rmrf(testDir); //remove test log dir
      //sh.exec('rm -rf ' + testDir, {silent:true}); //remove test log dir  
    }
  });

});
