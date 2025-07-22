import { creatorState } from './creatorState.js'

document.addEventListener("keydown", (e) => {

    const { indicator, linkIcon, linkText } = getConsts()

    if(e.shiftKey && creatorState.currentItem === "Delete") {
        creatorState.disableDrag = true;
        indicator.style.border = "0.4rem solid #FFA500";
        linkIcon.style.color = "#FFA500";
        linkText.style.color = "#FFA500";
    }
})

document.addEventListener("keyup", (e) => {

    const { indicator, linkIcon, linkText } = getConsts()

    if(!e.shiftKey && creatorState.currentItem === "Delete") {
        creatorState.disableDrag = false
        indicator.style.border = "0.4rem solid #4070F4";
        linkIcon.style.color = "#4070F4";
        linkText.style.color = "#4070F4";
    }
})

function getConsts() {
    const indicator = document.querySelector(".indicator");
    const linkIcon = (document.querySelectorAll(".link-icon"))[2]
    const linkText = (document.querySelectorAll(".link-text"))[2]

    return { indicator, linkIcon, linkText }
}