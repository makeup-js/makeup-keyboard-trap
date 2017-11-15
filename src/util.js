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

function createTrapBoundary() {
    const div = document.createElement('div');
    div.setAttribute('tabindex', '0');
    div.className = 'keyboard-trap-boundary';

    return div;
}

module.exports = {
    createTrapBoundary,
    focusableElementsList
};
