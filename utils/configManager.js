var utils = require('../utils/utils');
var urlencode = require('urlencode2');


var _configDict = {};
exports.readConfigSync = function(path) {
    var pathEncoded = urlencode(path);
    var dict = _configDict[pathEncoded];
    if (dict) {
        return dict;
    }
    else {
        dict = utils.readIniSync(path);
        _configDict[pathEncoded] = dict;
        return _configDict[pathEncoded];
    }
}
