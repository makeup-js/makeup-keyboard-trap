$_mod.installed("makeup-keyboard-trap$0.0.8", "custom-event-polyfill", "0.3.0");
$_mod.main("/custom-event-polyfill$0.3.0", "custom-event-polyfill");
$_mod.def("/custom-event-polyfill$0.3.0/custom-event-polyfill", function(require, exports, module, __filename, __dirname) { // Polyfill for creating CustomEvents on IE9/10/11

// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill

try {
    var ce = new window.CustomEvent('test');
    ce.preventDefault();
    if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error('Could not prevent default');
    }
} catch(e) {
  var CustomEvent = function(event, params) {
    var evt, origPrevent;
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };

    evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    origPrevent = evt.preventDefault;
    evt.preventDefault = function () {
      origPrevent.call(this);
      try {
        Object.defineProperty(this, 'defaultPrevented', {
          get: function () {
            return true;
          }
        });
      } catch(e) {
        this.defaultPrevented = true;
      }
    };
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent; // expose definition to window
}

});
$_mod.installed("makeup-keyboard-trap$0.0.8", "makeup-focusables", "0.0.2");
$_mod.main("/makeup-focusables$0.0.2", "");
$_mod.def("/makeup-focusables$0.0.2/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var focusableElList = ['a[href]', 'area[href]', 'button:not([disabled])', 'embed', 'iframe', 'input:not([disabled])', 'object', 'select:not([disabled])', 'textarea:not([disabled])', '*[tabindex]', '*[contenteditable]'];

var focusableElSelector = focusableElList.join();

module.exports = function (el) {
    var keyboardOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var focusableEls = Array.prototype.slice.call(el.querySelectorAll(focusableElSelector));

    // filter out elements with display: none
    focusableEls = focusableEls.filter(function (focusableEl) {
        return window.getComputedStyle(focusableEl).display !== 'none';
    });

    if (keyboardOnly === true) {
        focusableEls = focusableEls.filter(function (focusableEl) {
            return focusableEl.getAttribute('tabindex') !== '-1';
        });
    }

    return focusableEls;
};

});
$_mod.def("/makeup-keyboard-trap$0.0.8/index", function(require, exports, module, __filename, __dirname) { 'use strict';

var focusables = require('/makeup-focusables$0.0.2/index'/*'makeup-focusables'*/);

// when bundled up with isomorphic components on the server, this code is run,
// so we must check if 'document' is defined.
var body = typeof document === 'undefined' ? null : document.body;

// for the element that will be trapped
var trappedEl = void 0;

// for the trap boundary/bumper elements
var topTrap = void 0;
var outerTrapBefore = void 0;
var innerTrapBefore = void 0;
var innerTrapAfter = void 0;
var outerTrapAfter = void 0;
var botTrap = void 0;

// for the first and last focusable element inside the trap
var firstFocusableElement = void 0;
var lastFocusableElement = void 0;

function createTrapBoundary() {
    var trapBoundary = document.createElement('div');

    trapBoundary.setAttribute('tabindex', '0');
    trapBoundary.className = 'keyboard-trap-boundary';

    return trapBoundary;
}

function setFocusToFirstFocusableElement() {
    firstFocusableElement.focus();
}

function setFocusToLastFocusableElement() {
    lastFocusableElement.focus();
}

function createTraps() {
    topTrap = createTrapBoundary();
    outerTrapBefore = topTrap.cloneNode();
    innerTrapBefore = topTrap.cloneNode();
    innerTrapAfter = topTrap.cloneNode();
    outerTrapAfter = topTrap.cloneNode();
    botTrap = topTrap.cloneNode();

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

        // let observers know the keyboard is no longer trapped
        trappedEl.dispatchEvent(new CustomEvent('keyboardUntrap', { bubbles: true }));

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
    trappedEl.dispatchEvent(new CustomEvent('keyboardTrap', { bubbles: true }));

    trappedEl.classList.add('keyboard-trap--active');

    return trappedEl;
}

function refresh() {
    if (topTrap && trappedEl) {
        var focusableElements = focusables(trappedEl);
        focusableElements = focusableElements.filter(function (el) {
            return !el.classList.contains('keyboard-trap-boundary');
        });
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
    }
}

module.exports = {
    refresh: refresh,
    trap: trap,
    untrap: untrap
};

});