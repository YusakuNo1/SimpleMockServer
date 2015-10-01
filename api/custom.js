"use strict"

function configAPIResponseHeaders(res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader("Access-Control-Allow-Origin", "*");
}

module.exports = {
    getTime: function(req, res) {
        var jsonData = { time: new Date().toUTCString() };
        configAPIResponseHeaders(res);
        res.send(jsonData);
    },
    
    configAPIResponseHeaders: configAPIResponseHeaders
}