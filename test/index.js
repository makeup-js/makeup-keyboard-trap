var keyboardTrap = require('../index.js');
var testData = require('./data.js');
var trapEl;
var onTrap;
var onUntrap;

function doBeforeAll(html) {
    document.querySelector('body').innerHTML = html;
    trapEl = document.querySelector('.dialog');
    onTrap = jasmine.createSpy('onTrap');
    onUntrap = jasmine.createSpy('onUntrap');

    trapEl.addEventListener('keyboardTrap', onTrap);
    trapEl.addEventListener('keyboardUntrap', onUntrap);
}

testData.forEach(function(data) {
    describe('given trap is not active,', function() {
        doBeforeAll(data.html);
        describe('when trap method is called', function() {
            beforeAll(function() {
                keyboardTrap.trap(trapEl);
            });
            it('it should have class keyboard-trap--active on trap', function() {
                expect(trapEl.classList.contains('keyboard-trap--active')).toEqual(true);
            });
            it('it should have six trap boundaries in body', function() {
                expect(document.querySelectorAll('.keyboard-trap-boundary').length).toEqual(6);
            });
            it('it should observe one trap event', function() {
                expect(onTrap).toHaveBeenCalledTimes(1);
            });
            it('it should observe zero untrap events', function() {
                expect(onUntrap).toHaveBeenCalledTimes(0);
            });
        });
    });
    describe('given trap is active,', function() {
        doBeforeAll(data.html);
        describe('when untrap method is called', function() {
            beforeAll(function() {
                onTrap.calls.reset();
                onUntrap.calls.reset();
                keyboardTrap.untrap();
            });
            it('it should have zero trap boundaries in body', function() {
                expect(document.querySelectorAll('.keyboard-trap-boundary').length).toEqual(0);
            });
            it('it should not have class keyboard-trap--active on trap', function() {
                expect(trapEl.classList.contains('keyboard-trap--active')).toEqual(false);
            });
            it('it should observe zero trap events', function() {
                expect(onTrap).toHaveBeenCalledTimes(0);
            });
            it('it should observe 1 untrap event', function() {
                expect(onUntrap).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('given trap is active, but the DOM has changed', function() {
        doBeforeAll(data.html);
        describe('when untrap method is called', function() {
            beforeAll(function() {
                keyboardTrap.trap(trapEl);
                document.querySelector('.keyboard-trap-boundary').remove();
            });
            it('it should not throw an error', function() {
                expect(keyboardTrap.untrap.bind()).not.toThrow();
            });
        });
    });
});
