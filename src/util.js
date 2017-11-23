'use strict';

let trapBoundary;

function createTrapBoundary() {
    if (trapBoundary) return trapBoundary.cloneNode();

    trapBoundary = document.createElement('div');
    trapBoundary.setAttribute('tabindex', '0');
    trapBoundary.className = 'keyboard-trap-boundary';

    return trapBoundary;
}

module.exports = {
    createTrapBoundary
};
