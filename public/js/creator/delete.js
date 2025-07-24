import { creatorState } from './creatorState.js'
import { initializeElement } from '../QoL.js';

let startX, startY

document.addEventListener("keydown", (e) => {

    if(e.shiftKey && creatorState.currentItem === "Delete") {
        if(creatorState.isSelecting) {
            updateStyles("#4070F4", false)
            creatorState.isSelecting = false;
            if (creatorState.selectionBox) creatorState.selectionBox.remove(); creatorState.selectionBox = null;
        } else {
            updateStyles("#FFA500", true)
            creatorState.isSelecting = true;
            //addButtons()
        }
    }
})

document.addEventListener("mousedown", (e) => {
    if(creatorState.isSelecting) {
       if (creatorState.selectionBox) creatorState.selectionBox.remove(); creatorState.selectionBox = null;
        startX = e.clientX; startY = e.clientY;

        creatorState.selectionBox = document.createElement('div');

        Object.assign(creatorState.selectionBox.style, {
            left: `${startX}px`,
            top: `${startY}px`
        })

        creatorState.selectionBox.classList.add("selectBox")

        document.body.appendChild(creatorState.selectionBox);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
})

function checkCollisions(selectBox) { //* In progress ================================================================
    const rect = selectBox.getBoundingClientRect();
    const allElem = document.querySelectorAll("*")
    const collidingNodes = []

    allElem.forEach(el => {
        const eRect = el.getBoundingClientRect();
        const isOverlap = rect.left < eRect.right && rect.right > eRect.left && rect.top < eRect.bottom && rect.bottom > eRect.top;   
        if(isOverlap && el.classList.contains("node")) collidingNodes.push(el)
    })

    return collidingNodes;
}   

function onMouseMove(e) {
    if (!creatorState.isSelecting) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const rectX = Math.min(currentX, startX);
    const rectY = Math.min(currentY, startY);
    const rectWidth = Math.abs(currentX - startX);
    const rectHeight = Math.abs(currentY - startY);

    Object.assign(creatorState.selectionBox.style, {
        left: `${rectX}px`,
        top: `${rectY}px`,
        width: `${rectWidth}px`,
        height: `${rectHeight}px`
    })

    const collNodes = checkCollisions(creatorState.selectionBox)

    collNodes.forEach(node => {
        node.classList.add("select-del")
    })
}

function onMouseUp(e) {
    if (creatorState.isSelecting) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

//* Change Colors
export function updateStyles(color, disableDrag) {
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

function addButtons() {
    var delBtn = initializeElement("button", "delAll", "Delete")
    document.body.appendChild(delBtn)
}