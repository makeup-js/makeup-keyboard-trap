"use strict";

var keyboardTrap = require("../index.js");
var assert = require("assert");

describe('when it is loaded from the server', function() {
    it("should not throw an error", function() {
        assert.deepEqual(keyboardTrap, {});
    });
});
