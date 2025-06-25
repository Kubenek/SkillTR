import { NODE_RADIUS, COLLISION_RADIUS, CLICK_MOVE_THRESHOLD, CLICK_TIME_THRESHOLD } from '../config.js';
import { creatorState } from './creatorState.js'

let offsetX, offsetY;
let nodeClicked = false;
let disableNodePlace = false;
let nodes = [];
let clickStartTime = 0;
let clickStartPos = {x:0, y: 0}

document.addEventListener("DOMContentLoaded", () => {
    const creatorArea = document.querySelector(".creator-area");
    const canvas = document.querySelector(".canvas-content");
    const tools = document.querySelector(".nav")

    tools.addEventListener("mouseover", () => {
        disableNodePlace = true;
    })

    tools.addEventListener("mouseout", () => {
        disableNodePlace = false;
    })

    creatorArea.addEventListener("mousedown", (e) => {
        const { x, y } = getClickPosition(creatorArea, e);
        clickStartTime = Date.now()
        clickStartPos = { x, y }
    });

    creatorArea.addEventListener("mouseup", (e) => {
        const { x, y } = getClickPosition(creatorArea, e);
        const timeDiff = Date.now() - clickStartTime
        const dist = Math.hypot(x - clickStartPos.x, y - clickStartPos.y)

        e.preventDefault()

        if(timeDiff < CLICK_TIME_THRESHOLD && dist < CLICK_MOVE_THRESHOLD && !nodeClicked) {
            !e.button ? addNodeAtLocation(canvas, x, y) : alert("unimplemented")
        }
    })
});

function getClickPosition(area, event) {
    const rect = area.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;

    const x = (rawX - creatorState.panX) / creatorState.zoom;
    const y = (rawY - creatorState.panY) / creatorState.zoom;

    return { x, y };
}

function addNodeAtLocation(canvas, x, y) {

    if(disableNodePlace) return
    if(creatorState.currentItem !== "Place") return

    const size = 15;
    const node = document.createElement("div");
    node.classList.add("node");

    node.style.position = "absolute";
    node.style.width = size + "px";
    node.style.height = size + "px";

    node.style.left = (x - size / 2) + "px";
    node.style.top = (y - size / 2) + "px";

    const nodeData = { elem: node, x, y };

    if(!nodesOverlap(nodeData)) {
        canvas.appendChild(node);
        nodes.push(nodeData);

        node.addEventListener("mousedown", (e) => {
            if(creatorState.currentItem === "Move") {;
                creatorState.isDraggingNode = true
                creatorState.draggingNodeElem = node
                creatorState.lastNodeData = nodeData
                creatorState.nodeOriginalX = node.offsetLeft
                creatorState.nodeOriginalY = node.offsetTop
                offsetX = e.clientX - node.offsetLeft
                offsetY = e.clientY - node.offsetTop
            } else if(creatorState.currentItem === "Connect") {
                node.classList.add("selected")
            } else if(creatorState.currentItem === "Delete") {

                creatorState.isPopupActive = true;
                
                var popup = document.createElement('div')
                var content = document.createElement('div')

                popup.classList.add("popupContainer")
                content.classList.add("popupBody")

                var p = document.createElement("p")
                p.innerText = "Delete Node?"

                var yBtn = document.createElement("button")
                var nBtn = document.createElement("button")
                yBtn.classList.add("yBtn"); nBtn.classList.add("nBtn")

                yBtn.innerText = "Yes"; nBtn.innerText = "No"

                var popupButtons = document.createElement("div")

                popupButtons.appendChild(yBtn); popupButtons.appendChild(nBtn)

                content.appendChild(p); content.appendChild(popupButtons)

                popup.appendChild(content)
                canvas.appendChild(popup)
                
            } else return
        });

    }
}

document.addEventListener("mousemove", (e) => {
    if(!creatorState.isDraggingNode || !creatorState.draggingNodeElem) return;
    const left = (e.clientX - offsetX) 
    const top = (e.clientY - offsetY) 

    creatorState.draggingNodeElem.style.left = left + 'px'
    creatorState.draggingNodeElem.style.top = top + 'px'

    creatorState.lastNodeData.x = left + NODE_RADIUS
    creatorState.lastNodeData.y = top + NODE_RADIUS
})

document.addEventListener("mouseup", (e) => {
    if (!creatorState.isDraggingNode || !creatorState.draggingNodeElem) return;

    if (nodesOverlap(creatorState.lastNodeData)) {
        creatorState.draggingNodeElem.style.left = creatorState.nodeOriginalX + "px";
        creatorState.draggingNodeElem.style.top = creatorState.nodeOriginalY + "px";

        creatorState.lastNodeData.x = creatorState.nodeOriginalX + NODE_RADIUS
        creatorState.lastNodeData.y = creatorState.nodeOriginalY + NODE_RADIUS
    }

    creatorState.isDraggingNode = false;
    creatorState.draggingNodeElem = null;
    creatorState.lastNodeData = null;
});

function nodesOverlap(currentNode) {

    for (const other of nodes) {
        if (other === currentNode) continue;

        if (circlesOverlap(currentNode.x, currentNode.y, other.x, other.y)) {
            return true;
        }
    }
    return false;
}

function circlesOverlap(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < COLLISION_RADIUS;
}
