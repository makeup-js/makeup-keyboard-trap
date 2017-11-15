$_mod.def("/makeup-keyboard-trap$0.0.2/util", function(require, exports, module, __filename, __dirname) { 'use strict';

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

});
$_mod.def("/makeup-keyboard-trap$0.0.2/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var util = require('/makeup-keyboard-trap$0.0.2/util'/*'./util.js'*/);

var body = typeof document === "undefined" ? null : document.body;

// the element that will be trapped
var trappedEl = void 0;

var topTrap = util.createTrapBoundary();
var outerTrapBefore = util.createTrapBoundary();
var innerTrapBefore = util.createTrapBoundary();
var innerTrapAfter = util.createTrapBoundary();
var outerTrapAfter = util.createTrapBoundary();
var botTrap = util.createTrapBoundary();

var firstFocusableElement = void 0;
var lastFocusableElement = void 0;

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
        var event = document.createEvent('Event');
        event.initEvent('keyboardUntrap', false, true);
        trappedEl.dispatchEvent(event);

        trappedEl = null;
    }
    return trappedEl;
}

function trap(el) {
    untrap();

    trappedEl = el;

    var focusableElements = trappedEl.querySelectorAll(util.focusableElementsList);
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

    body.insertBefore(topTrap, body.childNodes[0]);
    trappedEl.parentNode.insertBefore(outerTrapBefore, trappedEl);
    trappedEl.insertBefore(innerTrapBefore, trappedEl.childNodes[0]);
    trappedEl.appendChild(innerTrapAfter);
    trappedEl.parentNode.insertBefore(outerTrapAfter, trappedEl.nextElementSibling);
    body.appendChild(botTrap);

    // let observers know the keyboard is now trapped
    var event = document.createEvent('Event');
    event.initEvent('keyboardTrap', false, true);
    trappedEl.dispatchEvent(event);

    trappedEl.classList.add('keyboard-trap--active');

    return trappedEl;
}

module.exports = {
    trap: trap,
    untrap: untrap
};

});