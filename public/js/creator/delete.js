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

       if (creatorState.selectionBox && !isDraggingBox) creatorState.selectionBox.remove(); creatorState.selectionBox = null;

        const selectedNodes = document.querySelectorAll(".select-del")
        selectedNodes.forEach(node => {
            node.classList.remove("select-del") 
        })

        startX = e.clientX; startY = e.clientY;
        hasMoved = false;

        creatorState.selectionBox = document.createElement('div');

        Object.assign(creatorState.selectionBox.style, {
            left: `${startX}px`,
            top: `${startY}px`
        })

        creatorState.selectionBox.classList.add("selectBox")

        enableDragging(creatorState.selectionBox)

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
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

        const left = (e.clientX - offsetX); const top = (e.clientY - offsetY);
        
        Object.assign(creatorState.selectionBox.style, {
            left: `${left}px`,
            top: `${top}px`
        });

        const collNodesNew = checkCollisions(creatorState.selectionBox)

        const prevSet = new Set(creatorState.selectCollidingNodes)
        const newSet = new Set(collNodesNew)

        for(const node of prevSet) {
            if(!newSet.has(node)) node.classList.remove("select-del")
        }

        for(const node of newSet) {
            if(!node.classList.contains("select-del")) node.classList.add("select-del")
        }

        creatorState.selectCollidingNodes = newSet

        return;
    }

    const currentX = e.clientX;
    const currentY = e.clientY;

    const dx = Math.abs(currentX - startX)
    const dy = Math.abs(currentY - startY)

    if(!hasMoved && (dx > 1 || dy > 1)) {
        hasMoved = true
    }

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

    creatorState.selectCollidingNodes = checkCollisions(creatorState.selectionBox)

    creatorState.selectCollidingNodes.forEach(node => {
        node.classList.add("select-del")
    })
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