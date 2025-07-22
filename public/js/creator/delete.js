import { creatorState } from './creatorState.js'

const indicator = document.querySelector(".indicator");

document.addEventListener("keydown", (e) => {
    if(e.shiftKey) {
        creatorState.disableDrag = true;
        indicator.style.border = "0.4rem solid #FFA500";
    }
})

document.addEventListener("keyup", (e) => {
    if(!e.shiftKey) {
        creatorState.disableDrag = false
        indicator.style.border = "0.4rem solid #4070F4";
    }
})