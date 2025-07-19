import { NODE_RADIUS, CLICK_MOVE_THRESHOLD, CLICK_TIME_THRESHOLD } from '../config.js';
import { creatorState } from './creatorState.js'
import { nodesOverlap, updateConnectedLines, updateConnectionLinesPositions, updateActiveLinePos, resetSelectData, getMousePosRelativeToCanvas, createDeletePopup, getClickPosition } from './functions.js';

let offsetX, offsetY;
let nodeClicked = false; let disableNodePlace = false;
let clickStartTime = 0; let clickStartPos = {x:0, y: 0}

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

function addNodeAtLocation(canvas, x, y) {
    if(disableNodePlace || creatorState.currentItem !== "Place") return

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
        creatorState.nodes.push(nodeData);

        node.addEventListener("mouseover", () => {
            creatorState.disableDrag = true
            creatorState.connections
                .filter(elem => elem.fromNode === node)
                .forEach(elem => {
                    elem.line.classList.replace("permanent-line", "highlighted-line")
                })
        })

        node.addEventListener("mouseout", () => {
            creatorState.disableDrag = false
             creatorState.connections
                .filter(elem => elem.fromNode === node)
                .forEach(elem => {
                    elem.line.classList.replace("highlighted-line", "permanent-line")
                })
        })

        node.addEventListener("mousedown", (e) => {
            if(creatorState.currentItem === "Move") {
                updateConnectionLinesPositions()
                creatorState.isDraggingNode = true
                creatorState.draggingNodeElem = node
                creatorState.lastNodeData = nodeData
                creatorState.nodeOriginalX = node.offsetLeft
                creatorState.nodeOriginalY = node.offsetTop
                offsetX = e.clientX - node.offsetLeft
                offsetY = e.clientY - node.offsetTop
            } else if(creatorState.currentItem === "Connect") {
                console.log(creatorState.connections)
                node.classList.add("selected")
                var slCount = creatorState.selectedCount + 1
                creatorState.selectedCount = slCount
                if(slCount == 1) {
                    creatorState.selectNodeFirst = node

                    const line = document.createElement("div")
                    line.classList.add("active-line")
                    canvas.append(line)
                    creatorState.activeLine = line

                    creatorState.mouseMoveHandler = function(e) {   
                        const mousePos = getMousePosRelativeToCanvas(e, canvas);
                        updateActiveLinePos(mousePos.x, mousePos.y);
                    };

                    document.addEventListener("mousemove", creatorState.mouseMoveHandler);

                } else if(slCount == 2) {
                    creatorState.selectNodeSecond = node
                    
                    document.removeEventListener("mousemove", creatorState.mouseMoveHandler)
                    creatorState.mouseMoveHandler = null

                    if(creatorState.selectNodeFirst === creatorState.selectNodeSecond) { 
                        creatorState.activeLine.remove();
                        creatorState.activeLine = null
                        resetSelectData(); return; 
                    }

                    const a = creatorState.selectNodeFirst;
                    const b = creatorState.selectNodeSecond;

                    const found = creatorState.connections.some(elem => {
                        const x = elem.fromNode;
                        const y = elem.toNode;
                        return (a === x && b === y) || (a === y && b === x);
                    });

                    if (found) {
                        creatorState.activeLine.remove();
                        creatorState.activeLine = null
                        resetSelectData();
                        return;
                    }

                    const line = creatorState.activeLine;
                    const rect1 = creatorState.selectNodeFirst.getBoundingClientRect();
                    const rect2 = creatorState.selectNodeSecond.getBoundingClientRect();

                    const x1 = rect1.left + rect1.width / 2;
                    const y1 = rect1.top + rect1.height / 2;
                    const x2 = rect2.left + rect2.width / 2;
                    const y2 = rect2.top + rect2.height / 2;

                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    line.style.width = `${length}px`;
                    line.style.left = `${x1}px`;
                    line.style.top = `${y1}px`;
                    line.style.transform = `rotate(${angle}deg)`;
                    line.classList.remove("active-line");
                    line.classList.add("permanent-line");

                    creatorState.connections.push({
                        fromNode: creatorState.selectNodeFirst,
                        toNode: creatorState.selectNodeSecond,
                        line: creatorState.activeLine
                    })

                    updateConnectionLinesPositions()

                    resetSelectData()
                }
            } else if(creatorState.currentItem === "Delete") {

                createDeletePopup(node)
                
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

    updateConnectedLines(creatorState.draggingNodeElem)

    updateConnectionLinesPositions()

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


