import { creatorState } from './creatorState.js'

document.addEventListener("keydown", (e) => {

    if(e.shiftKey && creatorState.currentItem === "Delete") {
        updateStyles("#FFA500", true)
    }
})

document.addEventListener("keyup", (e) => {

    if(!e.shiftKey && creatorState.currentItem === "Delete") {
        updateStyles("#4070F4", false)
    }
})

function updateStyles(color, disableDrag) {

    const { indicator, linkIcon, linkText } = getConsts();

    creatorState.disableDrag = disableDrag;
    indicator.style.border = `0.4rem solid ${color}`;
    linkIcon.style.color = color;
    linkText.style.color = color;
}

function getConsts() {
    const indicator = document.querySelector(".indicator");
    const linkIcon = (document.querySelectorAll(".link-icon"))[2]
    const linkText = (document.querySelectorAll(".link-text"))[2]

    return { indicator, linkIcon, linkText }
}