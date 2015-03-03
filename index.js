var yaml  = require('js-yaml'),
    async = require('async'),
    git   = require('nodegit'),
    fs    = require('fs'),
    path  = require('path');

var sourcePackagesFile = 'source-packages';

module.exports = PubTool;

function PubTool() {
}

PubTool.prototype.loadSourceManifest = function (dir) {
  var manifest = loadManifest(dir, sourcePackagesFile);
  this.manifest = manifest;
  return manifest;
};

PubTool.prototype.clonePackages = function (dest, callback) {
  var packageUrls = [];

  Object.keys(this.manifest).forEach(function (pkg) {
    packageUrls.push(this.manifest[pkg]);
  }.bind(this));

  async.eachSeries(packageUrls, function (url, cb) {
    git.Clone.clone(url, dest, {
      remoteCallbacks: {
        credentials: function (url, userName) {
          console.log(url, userName);
          return Git.Cred.userpassPlaintextNew(process.env.GITHUB_TOKEN, '');
        }
      }
    })
    .then(function (repo) {
      cb()
    })
    .catch(function (err) {
      cb(err);
    });
  }, callback);
};

function loadManifest(dir, filename) {
  var filepath = path.join(dir, filename);
  var tempfile, finalpath, contents, doc;

  if (!fs.existsSync(filepath)) {
    if (!path.extname(filepath)) {
      tempfile = filepath + '.yaml';
      if (fs.existsSync(tempfile)) {
        finalpath = tempfile;
      } else {
        tempfile = filepath + '.yml';
        if (fs.existsSync(tempfile)) {
          finalpath = tempfile;
        } else {
          tempfile = filepath + '.json';
          if (fs.existsSync(tempfile)) {
            finalpath = tempfile
          }
        }
      }
    }
  } else {
    finalpath = filepath;
  }

  if (!finalpath) {
    throw new Error('file not found: ' + filepath);
  }

  contents = fs.readFileSync(finalpath, {encoding: 'utf8'});
  doc = yaml.safeLoad(contents);
  return doc;
}