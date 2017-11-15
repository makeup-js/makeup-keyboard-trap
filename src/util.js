'use strict';

const focusableElementsList = [
    'a[href]',
    'button:not([disabled])',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '*[tabindex]',
    '*[contenteditable]'
];

let trapBoundary;
if (typeof document !== "undefined") {
    trapBoundary = document.createElement('div');
    trapBoundary.setAttribute('tabindex', '0');
    trapBoundary.className = 'keyboard-trap-boundary';
}

const noop = { addEventListener: () => {} };

function createTrapBoundary() {
    return trapBoundary ? trapBoundary.cloneNode() : noop;
}

module.exports = {
    createTrapBoundary,
    focusableElementsList
};
