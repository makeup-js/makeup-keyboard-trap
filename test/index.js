var keyboardTrap = require('../index.js');
var util = require('../util.js');
var testData = require('./data.js');
var trapEl;
var trapNotified;
var untrapNotified;

function doBeforeAll(html) {
    document.querySelector('body').innerHTML = html;
    trapEl = document.querySelector('.dialog');
    trapNotified = [];
    untrapNotified = [];

    trapEl.addEventListener('keyboardTrap', function() {
        trapNotified.push(true);
    });

    trapEl.addEventListener('keyboardUntrap', function() {
        untrapNotified.push(true);
    });
}

testData.forEach(function(data) {
    describe('makeup-keyboard-trap', function() {
        doBeforeAll(data.html);
        describe('when trap is activated', function() {
            beforeAll(function() {
                keyboardTrap.trap(trapEl);
            });
            it("should have class keyboard-trap--active on trap", function() {
                expect(trapEl.classList.contains('keyboard-trap--active')).toEqual(true);
            });
            it("should have six trap boundaries in body", function() {
                expect(document.querySelectorAll('.keyboard-trap-boundary').length).toEqual(6);
            });
            it('should observe one trap event', function() {
                expect(trapNotified.length).toEqual(1);
            });
            it('should observe zero untrap events', function() {
                expect(untrapNotified.length).toEqual(0);
            });
        });

        describe('when trap is deactivated', function() {
            beforeAll(function() {
                keyboardTrap.untrap();
            });
            it("should have zero trap boundaries in body", function() {
                expect(document.querySelectorAll('.keyboard-trap-boundary').length).toEqual(0);
            });
            it("should not have class keyboard-trap--active on trap", function() {
                expect(trapEl.classList.contains('keyboard-trap--active')).toEqual(false);
            });
            it('should observe no more trap event', function() {
                expect(trapNotified.length).toEqual(1);
            });
            it('should observe one untrap event', function() {
                expect(untrapNotified.length).toEqual(1);
            });
        });
    });
});
