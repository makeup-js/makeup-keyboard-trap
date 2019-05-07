# makeup-keyboard-trap

<p>
    <a href="https://travis-ci.org/makeup-js/makeup-keyboard-trap"><img src="https://api.travis-ci.org/makeup-js/makeup-keyboard-trap.svg?branch=master" alt="Build Status" /></a>
    <a href='https://coveralls.io/github/makeup-js/makeup-keyboard-trap?branch=master'><img src='https://coveralls.io/repos/makeup-js/makeup-keyboard-trap/badge.svg?branch=master&service=github' alt='Coverage Status' /></a>
    <a href="https://david-dm.org/makeup-js/makeup-keyboard-trap"><img src="https://david-dm.org/makeup-js/makeup-keyboard-trap.svg" alt="Dependency status" /></a>
    <a href="https://david-dm.org/makeup-js/makeup-keyboard-trap#info=devDependencies"><img src="https://david-dm.org/makeup-js/makeup-keyboard-trap/dev-status.svg" alt="devDependency status" /></a>
</p>

A vanilla JavaScript port of <a href="https://github.com/ianmcburnie/jquery-keyboard-trap">jquery-keyboard-trap</a>.

This module restricts keyboard tabindex to a single subtree in the DOM. This behaviour is useful when implementing a modal interface (e.g. a modal dialog).

It will ignore <em>programmatically</em> focusable items with a tabindex of `-1`.

## Experimental

This module is still in an experimental state, until it reaches v1.0.0 you must consider all minor releases as breaking changes. Patch releases may introduce new features, but will be backwards compatible.

```js
const keyboardTrap = require('makeup-keyboard-trap');

// trap an element
keyboardTrap.trap(document.querySelector('el'));

// untrap the current trapped element
keyboardTrap.untrap();
```

## Install

```js
// via npm
npm install makeup-keyboard-trap

// via yarn
yarn add makeup-keyboard-trap
```

## Events

* keyboardTrap : fired by trapped element when keyboard trap is activated
* keyboardUntrap : fired by trapped element when keyboard trap is deactivated

## Dependencies

* [makeup-focusables](https://github.com/makeup-js/makeup-focusables)

## Polyfills

* [custom-event-polyfill](https://github.com/krambuhl/custom-event-polyfill)

## Development

* `npm start`
* `npm test`
* `npm run lint`
* `npm run fix`
* `npm run build`
* `npm run clean`

## Test Reports

Each test run will generate the following reports:

* `/reports/coverage` contains Istanbul code coverage report
* `/reports/html` contains HTML test report

## CI Build

https://travis-ci.org/makeup-js/makeup-keyboard-trap

## Code Coverage

https://coveralls.io/github/makeup-js/makeup-keyboard-trap
