/* globals define, document, module */
'use strict';

(function (name, context, definition) {
    if (typeof define === 'function') {
        define(definition);
    } else if (typeof module !== 'undefined') {
        module.exports = definition();
    } else {
        context[name] = definition(); // eslint-disable-line no-param-reassign
    }
})('keyboardTrap', undefined, function () {
    if (typeof document === "undefined") return {};

    var focusableElementsList = ['a[href]', 'button:not([disabled])', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'object', 'embed', '*[tabindex]', '*[contenteditable]'];

    function createTrapBoundary() {
        var div = document.createElement('div');
        div.setAttribute('tabindex', '0');
        div.className = 'keyboard-trap-boundary';

        return div;
    }

    var body = typeof document === "undefined" ? {} : document.body;

    // the element that will be trapped
    var trappedEl = void 0;

    var topTrap = createTrapBoundary();
    var outerTrapBefore = createTrapBoundary();
    var innerTrapBefore = createTrapBoundary();
    var innerTrapAfter = createTrapBoundary();
    var outerTrapAfter = createTrapBoundary();
    var botTrap = createTrapBoundary();

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

        var focusableElements = trappedEl.querySelectorAll(focusableElementsList);
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

    return {
        trap: trap,
        untrap: untrap,
        createTrapBoundary: createTrapBoundary,
        focusableElementsList: focusableElementsList
    };
});
