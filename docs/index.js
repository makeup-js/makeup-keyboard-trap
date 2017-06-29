var keyboardTrap = require('../index.js');

var trap = document.getElementById('trap');
var btn = document.querySelector('button');

btn.addEventListener('click', function() {
    if (this.getAttribute('aria-pressed') === 'true') {
        keyboardTrap.untrap();
    } else {
        keyboardTrap.trap(this.parentNode);
    }
});

trap.addEventListener('keyboardUntrap', function() {
    btn.innerText = 'Trap';
    btn.setAttribute('aria-pressed', 'false');
});

trap.addEventListener('keyboardTrap', function() {
    btn.innerText = 'Untrap';
    btn.setAttribute('aria-pressed', 'true');
});
