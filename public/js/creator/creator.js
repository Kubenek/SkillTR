let nodeClicked = false;
let disableNodePlace = false;
let nodes = [];
let clickStartTime = 0;
let clickStartPos = {x:0, y: 0}

import { NODE_RADIUS, COLLISION_RADIUS, CLICK_MOVE_THRESHOLD, CLICK_TIME_THRESHOLD } from '../config.js';

window.isDraggingNode = false;
let offsetX, offsetY;

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
            !e.button ? addNodeAtLocation(canvas, x, y) : alert("elo morod wsm to masz trojana xd 404")
        }
    })
});

function getClickPosition(area, event) {
    const rect = area.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;

    const x = (rawX - window.panX) / window.zoom;
    const y = (rawY - window.panY) / window.zoom;

    return { x, y };
}

function addNodeAtLocation(canvas, x, y) {

    if(disableNodePlace) return
    if(window.currentItem !== "Place") return

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
            if(window.currentItem !== "Move") return;
            window.isDraggingNode = true
            window.draggingNodeElem = node
            window.lastNodeData = nodeData
            window.originalX = node.offsetLeft
            window.originalY = node.offsetTop
            offsetX = e.clientX - node.offsetLeft
            offsetY = e.clientY - node.offsetTop
        });

    }
}

document.addEventListener("mousemove", (e) => {
    if(!window.isDraggingNode || !window.draggingNodeElem) return;
    const left = (e.clientX - offsetX) 
    const top = (e.clientY - offsetY) 

    window.draggingNodeElem.style.left = left + 'px'
    window.draggingNodeElem.style.top = top + 'px'

    window.lastNodeData.x = left + NODE_RADIUS
    window.lastNodeData.y = top + NODE_RADIUS
})

document.addEventListener("mouseup", (e) => {
    if (!window.isDraggingNode || !window.draggingNodeElem) return;

    if (nodesOverlap(window.lastNodeData)) {
        window.draggingNodeElem.style.left = window.originalX + "px";
        window.draggingNodeElem.style.top = window.originalY + "px";

        window.lastNodeData.x = window.originalX + NODE_RADIUS
        window.lastNodeData.y = window.originalY + NODE_RADIUS
    }

    window.isDraggingNode = false;
    window.draggingNodeElem = null;
    window.lastNodeData = null;
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
