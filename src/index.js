import _ from 'lodash';
import './style.css';
import Gameboard from './modules/gameboard.js';
import robot from './robotImage.png';
import textBubble from './textBubble.png';

const admiralName = document.getElementById('admiralName');
const playerName = document.querySelector('.playerName');
admiralName.value = 'John';

Gameboard(5);

document.addEventListener("DOMContentLoaded", function() {
    function resizeInput() {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'pre';
        span.style.fontSize = window.getComputedStyle(admiralName).fontSize;
        span.textContent = admiralName.value || admiralName.placeholder;

        document.body.appendChild(span);
        admiralName.style.width = `${span.offsetWidth + 25}px`;
        document.body.removeChild(span);
    }
    resizeInput();
    admiralName.addEventListener('input', (e) =>{
        resizeInput();
        playerName.textContent = ' ' + admiralName.value;
    });
});