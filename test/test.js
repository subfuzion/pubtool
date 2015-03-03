var assert = require('assert'),
    fsx = require('fs-extra'),
    path = require('path'),
    PubTool = require('..');

var sampleDir = path.join(__dirname, 'sample');
var clonePath = path.join(__dirname, 'tmp');

var notImplementedError = new Error('not implemented');

before(function() {
  if (fsx.existsSync(clonePath)) {
    fsx.removeSync(clonePath);
  }

  //fsx.ensureDirSync(clonePath);

});


describe('tests', function() {
  var pubtool = new PubTool();

  it ('should load source packages manifest', function() {
    pubtool.loadSourceManifest(sampleDir);

    assert(typeof pubtool.manifest === 'object');
    assert.equal(pubtool.manifest.aqua, 'https://github.com/aquajs/aqua.git');
  });


  it ('should clone the manifest packages', function(done) {
    pubtool.clonePackages(clonePath, done);
  });


  it ('should clone the manifest packages', function() {
    throw notImplementedError;
  });


  it ('should get the latest tags for each package', function() {
    throw notImplementedError;
  });


  it ('should bump version and tag for updated packages', function() {
    throw notImplementedError;
  });


  it ('should commit and push updated packages', function() {
    throw notImplementedError;
  });


  it ('should publish updated packages', function() {
    throw notImplementedError;
  });
});

