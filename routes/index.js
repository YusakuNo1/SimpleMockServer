var express = require('express');
var router = express.Router();
var configManager = require('../utils/configManager');
var utils = require('../utils/utils');

var customEndPoint = require('../api/custom');


// Home page
router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.render('index', { title: 'DigitLegend' });
});


// Setup api/config.ini
var apiConfig = configManager.readConfigSync("api/config.ini");

var kKeySettings = 'settings';
var kRootUrl = apiConfig[kKeySettings]["root"];

setupEndpoint('endpoint-get', 'get');
setupEndpoint('endpoint-post', 'post');
setupEndpoint('endpoint-put', 'put');
setupEndpoint('endpoint-delete', 'delete');

var kKeyEndPointCustom = 'endpoint-custom';
Object.keys(apiConfig[kKeyEndPointCustom]).forEach(function (endpointKey) {
    var kEndPoint = kRootUrl + utils.urlNormalize(endpointKey);

    router.get(kEndPoint, function(req, res) {
        customEndPoint[apiConfig[kKeyEndPointCustom][endpointKey]](req, res);
    });
});

module.exports = router;


// Private
function setupEndpoint(key, method) {
    if (!apiConfig[key]) {
        return;
    }

    Object.keys(apiConfig[key]).forEach(function (endpointKey) {
        var kEndPoint = kRootUrl + utils.urlNormalize(endpointKey);

        console.log("Enabled endpoint: " + kEndPoint);

        router[method](kEndPoint, function(req, res, next) {
            customEndPoint.configAPIResponseHeaders(res);
            
            var endpointValue = apiConfig[key][endpointKey].trim();

            if (endpointValue[0] == '[') {
                // This is a switch endpoint
                var kSwitchGroupKey = endpointValue.substring(1, endpointValue.length-1);
                var kSwitchParams = findParameters(req, endpointKey);
                endpointValue = findSwitchEndpointFile(kSwitchGroupKey, kSwitchParams);

                if (endpointValue == undefined) {
                    next(404, req, res);
                    return;
                }
            }

            var jsonData = utils.readJsonSync('api/' + endpointValue);
            if (jsonData) {
                res.send(jsonData);
            }
            else {
                next(500, req, res);
            }
        });
    });
}


// Error
router.use(function(req, res, next) {
    processError(404, req, res, next);
});

router.use(function(errorCode, req, res, next) {
    errorCode = (typeof errorCode == "number") ? errorCode : 500;
    processError(errorCode, req, res, next);
});

function processError(errorCode, req, res, next) {
    var jsonData = utils.readJsonSync('api/' + apiConfig[kKeySettings]["status_" + errorCode]);
    if (!jsonData) {
        jsonData = {
            "code": 500,
            "errorMessage": "Internal Server Error (Mock JSON for 500 error is missing)",
            "resposnse": null
        }
    }

    res.status(errorCode);
    res.send(jsonData);
};


// Private -------------

function findSwitchEndpointFile(switchGroupKey, params) {
    var kKeys = Object.keys(apiConfig[switchGroupKey]);
    for (var i=0; i<kKeys.length; ++i) {
        var switchKey = kKeys[i];
        var splittedParamArray = switchKey.split(',');
        if (splittedParamArray.length == params.length) {
            var j = 0;
            for (; j < params.length; ++j) {
                if (splittedParamArray[j].trim() != params[j].trim()) {
                    break;
                }
            }

            if (j == params.length) {
                return apiConfig[switchGroupKey][switchKey];
            }
        }
    }

    return undefined;
}

function findParameters(req, s) {
    var params = [];
    var currentParam = undefined;
    for (var i=0; i<s.length; ++i) {
        if (currentParam != undefined) {
            if (s[i] == '/') {
                params.push(req.param(currentParam));
                currentParam = undefined;
            }
            else {
                currentParam += s[i];
            }
        }
        else {
            if (s[i] == ':') {
                currentParam = "";
            }
        }
    }

    if (currentParam != undefined) {
        params.push(req.param(currentParam));
    }

    return params;
}
