'use strict';

var assert = require("assert");
var utils = require('../utils/utils');


describe('utils/utils/urlNormal', function () {
    var kValidUrl = '/api/v1';

    function processSub(url) {
        return function (done) {
            var newUrl = utils.urlNormalize(url);
            assert.ok(kValidUrl == newUrl);
            done();
        }
    }

    it('No begin slash', processSub(kValidUrl.substring(1, kValidUrl.length)));
    it('Has ending slash', processSub(kValidUrl + '/'));
    it('No begin slash and has ending slash', processSub(kValidUrl.substring(1, kValidUrl.length) + '/'));

    it('Valid url', processSub(kValidUrl));
});
