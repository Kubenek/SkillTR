let nodeClicked = false;
let disableNodePlace = false;
let nodes = [];
let clickStartTime = 0;
let clickStartPos = {x:0, y: 0}

window.creatorSharedData ??= {
    zoom: 1,
    panX: 0,
    panY: 0,
    isDraggingNode: false,
    draggingNodeElem: null,
    lastNodeData: null,
    currentItem: "Place",
    nodeOriginalX: 0,
    nodeOriginalY: 0
}

import { NODE_RADIUS, COLLISION_RADIUS, CLICK_MOVE_THRESHOLD, CLICK_TIME_THRESHOLD } from '../config.js';

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
            !e.button ? addNodeAtLocation(canvas, x, y) : alert("unimplemented")
        }
    })
});

function getClickPosition(area, event) {
    const rect = area.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;

    const x = (rawX - window.creatorSharedData.panX) / window.creatorSharedData.zoom;
    const y = (rawY - window.creatorSharedData.panY) / window.creatorSharedData.zoom;

    return { x, y };
}

function addNodeAtLocation(canvas, x, y) {

    if(disableNodePlace) return
    if(window.creatorSharedData.currentItem !== "Place") return

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
            if(window.creatorSharedData.currentItem !== "Move") return;
            window.creatorSharedData.isDraggingNode = true
            window.creatorSharedData.draggingNodeElem = node
            window.creatorSharedData.lastNodeData = nodeData
            window.creatorSharedData.nodeOriginalX = node.offsetLeft
            window.creatorSharedData.nodeOriginalY = node.offsetTop
            offsetX = e.clientX - node.offsetLeft
            offsetY = e.clientY - node.offsetTop
        });

    }
}

document.addEventListener("mousemove", (e) => {
    if(!window.creatorSharedData.isDraggingNode || !window.creatorSharedData.draggingNodeElem) return;
    const left = (e.clientX - offsetX) 
    const top = (e.clientY - offsetY) 

    window.creatorSharedData.draggingNodeElem.style.left = left + 'px'
    window.creatorSharedData.draggingNodeElem.style.top = top + 'px'

    window.creatorSharedData.lastNodeData.x = left + NODE_RADIUS
    window.creatorSharedData.lastNodeData.y = top + NODE_RADIUS
})

document.addEventListener("mouseup", (e) => {
    if (!window.creatorSharedData.isDraggingNode || !window.creatorSharedData.draggingNodeElem) return;

    if (nodesOverlap(window.creatorSharedData.lastNodeData)) {
        window.creatorSharedData.draggingNodeElem.style.left = window.creatorSharedData.nodeOriginalX + "px";
        window.creatorSharedData.draggingNodeElem.style.top = window.creatorSharedData.nodeOriginalY + "px";

        window.creatorSharedData.lastNodeData.x = window.creatorSharedData.nodeOriginalX + NODE_RADIUS
        window.creatorSharedData.lastNodeData.y = window.creatorSharedData.nodeOriginalY + NODE_RADIUS
    }

    window.creatorSharedData.isDraggingNode = false;
    window.creatorSharedData.draggingNodeElem = null;
    window.creatorSharedData.lastNodeData = null;
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
