module.exports = {
    getTime: function(req, res) {
        var jsonData = { time: new Date().toUTCString() };
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(jsonData);
    }
}