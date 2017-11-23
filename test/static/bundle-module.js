$_mod.installed("makeup-keyboard-trap$0.0.4", "makeup-focusables", "0.0.1");
$_mod.main("/makeup-focusables$0.0.1", "");
$_mod.def("/makeup-focusables$0.0.1/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var focusableElList = ['a[href]', 'area[href]', 'button:not([disabled])', 'embed', 'iframe', 'input:not([disabled])', 'object', 'select:not([disabled])', 'textarea:not([disabled])', '*[tabindex]', '*[contenteditable]'];

var focusableElSelector = focusableElList.join();

module.exports = function (el) {
    var keyboardOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var focusableEls = Array.prototype.slice.call(el.querySelectorAll(focusableElSelector));

    if (keyboardOnly === true) {
        focusableEls = focusableEls.filter(function (focusableEl) {
            return focusableEl.getAttribute('tabindex') !== '-1';
        });
    }

    return focusableEls;
};

});
$_mod.def("/makeup-keyboard-trap$0.0.4/util", function(require, exports, module, __filename, __dirname) { 'use strict';

var trapBoundary = void 0;

function createTrapBoundary() {
    if (trapBoundary) return trapBoundary.cloneNode();

    trapBoundary = document.createElement('div');
    trapBoundary.setAttribute('tabindex', '0');
    trapBoundary.className = 'keyboard-trap-boundary';

    return trapBoundary;
}

module.exports = {
    createTrapBoundary: createTrapBoundary
};

});
$_mod.def("/makeup-keyboard-trap$0.0.4/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var focusables = require('/makeup-focusables$0.0.1/index'/*'makeup-focusables'*/);
var util = require('/makeup-keyboard-trap$0.0.4/util'/*'./util.js'*/);

// when bundled up with isomorphic components on the server, this code is run,
// so we must check if 'document' is defined.
var body = typeof document === "undefined" ? null : document.body;

// the element that will be trapped
var trappedEl = void 0;

// the trap boundaries/bumpers
var topTrap = void 0;
var outerTrapBefore = void 0;
var innerTrapBefore = void 0;
var innerTrapAfter = void 0;
var outerTrapAfter = void 0;
var botTrap = void 0;

var firstFocusableElement = void 0;
var lastFocusableElement = void 0;

function setFocusToFirstFocusableElement() {
    firstFocusableElement.focus();
}

function setFocusToLastFocusableElement() {
    lastFocusableElement.focus();
}

function createTraps() {
    topTrap = util.createTrapBoundary();
    outerTrapBefore = util.createTrapBoundary();
    innerTrapBefore = util.createTrapBoundary();
    innerTrapAfter = util.createTrapBoundary();
    outerTrapAfter = util.createTrapBoundary();
    botTrap = util.createTrapBoundary();

    topTrap.addEventListener('focus', setFocusToFirstFocusableElement);
    outerTrapBefore.addEventListener('focus', setFocusToFirstFocusableElement);
    innerTrapBefore.addEventListener('focus', setFocusToLastFocusableElement);
    innerTrapAfter.addEventListener('focus', setFocusToFirstFocusableElement);
    outerTrapAfter.addEventListener('focus', setFocusToLastFocusableElement);
    botTrap.addEventListener('focus', setFocusToLastFocusableElement);
}

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
    if (!topTrap) {
        createTraps();
    } else {
        untrap();
    }

    trappedEl = el;

    var focusableElements = focusables(trappedEl);
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