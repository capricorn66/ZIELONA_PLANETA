import ripplet from 'ripplet.js';
import {defaultOptions} from 'ripplet.js';
defaultOptions.color = 'rgba(255, 255, 255, .2)';

/**
 * initialization of Ripplet plugin on appropriate buttons.
 * @return {undefined}
 */
export function rippletInit(root = document) {
    const buttons = root.querySelectorAll('.btn-primary, .btn-outline-primary');
    Array.from(buttons).forEach(
        button => button.addEventListener('mousedown', ripplet),
    );
}
