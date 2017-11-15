'use strict';

var focusableElementsList = ['a[href]', 'button:not([disabled])', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'object', 'embed', '*[tabindex]', '*[contenteditable]'];

// when bundled up with isomorphic components on the server, this code is run, so we must check if
// 'document' is defined. When it is not, on the server, we return a no-op there. Since addEventListener
// is loaded and called in index.js on the server, we include that method as a no-op as well.
var NOOP = { addEventListener: function addEventListener() {} };
var trapBoundary = void 0;

var getTrapBoundary = function getTrapBoundary() {
    if (trapBoundary) return trapBoundary.cloneNode();
    if (typeof document === "undefined") return NOOP;

    trapBoundary = document.createElement('div');
    trapBoundary.setAttribute('tabindex', '0');
    trapBoundary.className = 'keyboard-trap-boundary';

    return trapBoundary;
};

function createTrapBoundary() {
    return getTrapBoundary();
}

module.exports = {
    createTrapBoundary: createTrapBoundary,
    focusableElementsList: focusableElementsList
};
