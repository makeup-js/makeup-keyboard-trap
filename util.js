'use strict';

var focusableElementsList = ['a[href]', 'button:not([disabled])', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'object', 'embed', '*[tabindex]', '*[contenteditable]'];

var trapBoundary = void 0;
if (typeof document !== "undefined") {
    trapBoundary = document.createElement('div');
    trapBoundary.setAttribute('tabindex', '0');
    trapBoundary.className = 'keyboard-trap-boundary';
}

var noop = { addEventListener: function addEventListener() {} };

function createTrapBoundary() {
    return trapBoundary ? trapBoundary.cloneNode() : noop;
}

module.exports = {
    createTrapBoundary: createTrapBoundary,
    focusableElementsList: focusableElementsList
};
