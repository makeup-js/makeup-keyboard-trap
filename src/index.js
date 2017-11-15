'use strict';

const util = require('./util.js');

const body = typeof document === "undefined" ? {} : document.body;

// the element that will be trapped
let trappedEl;

let topTrap = util.createTrapBoundary();
let outerTrapBefore = util.createTrapBoundary();
let innerTrapBefore = util.createTrapBoundary();
let innerTrapAfter = util.createTrapBoundary();
let outerTrapAfter = util.createTrapBoundary();
let botTrap = util.createTrapBoundary();

let firstFocusableElement;
let lastFocusableElement;

function setFocusToFirstFocusableElement() {
    firstFocusableElement.focus();
}

function setFocusToLastFocusableElement() {
    lastFocusableElement.focus();
}

topTrap.addEventListener('focus', setFocusToFirstFocusableElement);
outerTrapBefore.addEventListener('focus', setFocusToFirstFocusableElement);
innerTrapBefore.addEventListener('focus', setFocusToLastFocusableElement);
innerTrapAfter.addEventListener('focus', setFocusToFirstFocusableElement);
outerTrapAfter.addEventListener('focus', setFocusToLastFocusableElement);
botTrap.addEventListener('focus', setFocusToLastFocusableElement);

function untrap() {
    if (trappedEl) {
        topTrap = body.removeChild(topTrap);
        outerTrapBefore = trappedEl.parentNode.removeChild(outerTrapBefore);
        innerTrapBefore = trappedEl.removeChild(innerTrapBefore);
        innerTrapAfter = trappedEl.removeChild(innerTrapAfter);
        outerTrapAfter = trappedEl.parentNode.removeChild(outerTrapAfter);
        botTrap = body.removeChild(botTrap);

        trappedEl.classList.remove('keyboard-trap--active');

        // let observers know the keyboard is now trapped
        const event = document.createEvent('Event');
        event.initEvent('keyboardUntrap', false, true);
        trappedEl.dispatchEvent(event);

        trappedEl = null;
    }
    return trappedEl;
}

function trap(el) {
    untrap();

    trappedEl = el;

    const focusableElements = trappedEl.querySelectorAll(util.focusableElementsList);
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

    body.insertBefore(topTrap, body.childNodes[0]);
    trappedEl.parentNode.insertBefore(outerTrapBefore, trappedEl);
    trappedEl.insertBefore(innerTrapBefore, trappedEl.childNodes[0]);
    trappedEl.appendChild(innerTrapAfter);
    trappedEl.parentNode.insertBefore(outerTrapAfter, trappedEl.nextElementSibling);
    body.appendChild(botTrap);

    // let observers know the keyboard is now trapped
    const event = document.createEvent('Event');
    event.initEvent('keyboardTrap', false, true);
    trappedEl.dispatchEvent(event);

    trappedEl.classList.add('keyboard-trap--active');

    return trappedEl;
}

module.exports = {
    trap,
    untrap
};
