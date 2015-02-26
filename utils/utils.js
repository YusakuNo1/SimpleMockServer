var fs = require('fs');
var ini = require('ini');
var path = require('path');

exports.readJson = function (filePath, callback) {
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return {}
        }
        else {
            return JSON.parse(data);
        }
    });
};

exports.readJsonSync = function (filePath, callback) {
    try {
        var data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    catch(e) {
        return undefined;
    }
};

exports.readIniSync = function (filePath) {
    var ext = path.extname(filePath);
    if (ext != '.ini') {
        filePath = filePath + '.ini';
    }
    var config = ini.parse(fs.readFileSync(filePath, 'utf-8'));
    return config;
};

exports.urlNormalize = function (url) {
    if (!url) {
        return "";
    }

    if (url[0] != '/') {
        url = '/' + url;
    }

    if (url[url.length-1] == '/') {
        url = url.substring(0, url.length - 1);
    }

    return url;
};
