import { creatorState } from './creatorState.js'
import { initializeElement } from '../QoL.js';

let startX, startY
let hasMoved = false
let isDraggingBox = false
let offsetX, offsetY

document.addEventListener("keydown", (e) => { //* Toggle Alt Delete

    if(e.shiftKey && creatorState.currentItem === "Delete") {
        if(creatorState.isSelecting) {
            updateStyles(false)
            creatorState.isSelecting = false;
            if (creatorState.selectionBox) creatorState.selectionBox.remove(); creatorState.selectionBox = null;
            const selectedNodes = document.querySelectorAll(".select-del")
            selectedNodes.forEach(node => {
                node.classList.remove("select-del") 
            })
        } else {
            updateStyles(true)
            creatorState.isSelecting = true;
        }
    }
})

document.addEventListener("mousedown", (e) => {

    if(creatorState.isSelecting) {

        if(e.target.closest(".nav")) return;
        if (creatorState.selectionBox && !isDraggingBox) creatorState.selectionBox.remove(); creatorState.selectionBox = null;

        const selectedNodes = document.querySelectorAll(".select-del")
        selectedNodes.forEach(node => node.classList.remove("select-del"))

        const { clientX: startX, clientY: startY } = e
        hasMoved = false;

        creatorState.selectionBox = document.createElement('div');

        Object.assign(creatorState.selectionBox.style, {
            left: `${startX}px`,
            top: `${startY}px`
        })

        creatorState.selectionBox.classList.add("selectBox")
        enableDragging(creatorState.selectionBox)

        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    }
})

function checkCollisions(selectBox) {
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

    if(isDraggingBox) {//* drag functionality
        const { clientX, clientY } = e;
        Object.assign(creatorState.selectionBox.style, {
            left: `${clientX - offsetX}px`,
            top: `${clientY - offsetY}px`
        });

        const newSet = new Set(checkCollisions(creatorState.selectionBox)); const prevSet = creatorState.selectCollidingNodes;

        for(const node of prevSet) if(!newSet.has(node)) node.classList.remove("select-del")
        for(const node of newSet) if(!node.classList.contains("select-del")) node.classList.add("select-del")

        creatorState.selectCollidingNodes = newSet
        return;
    }

    const { clinetX: x, clientY: y } = e;
    const dx = Math.abs(x - startX)
    const dy = Math.abs(y - startY)

    if(!hasMoved && (dx > 1 || dy > 1)) hasMoved = true

    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);
    const width = dx;
    const height = dy;

    Object.assign(creatorState.selectionBox.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`
    })

    const colliding = checkCollisions(creatorState.selectionBox)
    colliding.forEach(node => node.classList.add("select-del"))

    creatorState.selectCollidingNodes = colliding
    document.body.appendChild(creatorState.selectionBox);
}

function onMouseUp(e) {
    if (creatorState.isSelecting) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        isDraggingBox = false
    }
}

function updateStyles(status) {
    const indicator = document.querySelector(".indicator")
    const linkItem = document.querySelectorAll(".link-item")[2]

    if(status) { linkItem.classList.add("del-active"); indicator.classList.add("del-active") }
    else { linkItem.classList.remove("del-active"); indicator.classList.remove("del-active") }
}

function addButtons() {
    var delBtn = initializeElement("button", "delAll", "Delete")
    document.body.appendChild(delBtn)
}

function enableDragging(box) {
    box.addEventListener('mousedown', (e) => {
        const rect = box.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        isDraggingBox = true;
        e.stopPropagation();

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}