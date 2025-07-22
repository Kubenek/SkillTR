import { creatorState } from './creatorState.js'

let isSelecting = false;
let startX, startY, selectionBox;

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

document.addEventListener("mousedown", (e) => {
    if(e.shiftKey && e.button === 0 && creatorState.currentItem === "Delete") {
        isSelecting = true;
        startX = e.clientX; startY = e.clientY;

        selectionBox = document.createElement('div');

        Object.assign(selectionBox.style, {
            position: "fixed",
            border: "2px dashed #FFA500",
            backgroundColor: "rgba(255, 165, 0, 0.2)",
            left: `${startX}px`,
            top: `${startY}px`,
            pointerEvents: "none"
        })

        document.body.appendChild(selectionBox);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
})

function onMouseMove(e) {
    if (!isSelecting) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const rectX = Math.min(currentX, startX);
    const rectY = Math.min(currentY, startY);
    const rectWidth = Math.abs(currentX - startX);
    const rectHeight = Math.abs(currentY - startY);

    Object.assign(selectionBox.style, {
        left: `${rectX}px`,
        top: `${rectY}px`,
        width: `${rectWidth}px`,
        height: `${rectHeight}px`
    })
}

function onMouseUp(e) {
    if (isSelecting) {
        isSelecting = false;

        if (selectionBox) selectionBox.remove(); selectionBox = null;

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

//* Change Colors
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
//* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=