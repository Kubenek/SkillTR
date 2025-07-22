import { NODE_RADIUS, CLICK_MOVE_THRESHOLD, CLICK_TIME_THRESHOLD } from '../config.js';
import { creatorState } from './creatorState.js'
import { nodesOverlap, updateConnectedLines, updateConnectionLinesPositions, updateActiveLinePos, resetSelectData, getMousePosRelativeToCanvas, createDeletePopup, getClickPosition, updateLinePosition } from './functions.js';

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

    Object.assign(node.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        left: `${x - size / 2}px`,
        top: `${y - size/2}px`
    })

    const nodeData = { elem: node, x, y };

    if(nodesOverlap(nodeData)) return;

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

            Object.assign(creatorState, {
                isDraggingNode: true,
                draggingNodeElem: node,
                lastNodeData: nodeData,
                nodeOriginalX: node.offsetLeft,
                nodeOriginalY: node.offsetTop
            })

            offsetX = e.clientX - node.offsetLeft
            offsetY = e.clientY - node.offsetTop
        } else if(creatorState.currentItem === "Connect") {
            node.classList.add("selected")
            var slCount = ++creatorState.selectedCount;

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

                const a = creatorState.selectNodeFirst; const b = creatorState.selectNodeSecond;

                const found = creatorState.connections.some(elem => {
                    const x = elem.fromNode; const y = elem.toNode;
                    return (a === x && b === y) || (a === y && b === x);
                });

                if (found) {
                    creatorState.activeLine.remove(); creatorState.activeLine = null;
                    resetSelectData();
                    return;
                }

                const line = creatorState.activeLine;
                const rect1 = creatorState.selectNodeFirst.getBoundingClientRect();
                const rect2 = creatorState.selectNodeSecond.getBoundingClientRect();

                updateLinePosition(line, rect1, rect2);

                line.classList.replace("active-line", "permanent-line")

                creatorState.connections.push({
                    fromNode: creatorState.selectNodeFirst,
                    toNode: creatorState.selectNodeSecond,
                    line: creatorState.activeLine
                })

                updateConnectedLines(a)
                resetSelectData()
            }
        } else if(creatorState.currentItem === "Delete") createDeletePopup(node); else return;
    });

}

document.addEventListener("mousemove", (e) => {
    if(!creatorState.isDraggingNode || !creatorState.draggingNodeElem) return;

    const left = (e.clientX - offsetX); const top = (e.clientY - offsetY);

    Object.assign(creatorState.draggingNodeElem.style, {
        left: `${left}px`,
        top: `${top}px`
    });

    updateConnectedLines(creatorState.draggingNodeElem)

    Object.assign(creatorState.lastNodeData, {
        x: left + NODE_RADIUS,
        y: top + NODE_RADIUS
    });

})

document.addEventListener("mouseup", (e) => {
    if (!creatorState.isDraggingNode || !creatorState.draggingNodeElem) return;

    if (nodesOverlap(creatorState.lastNodeData)) {

        Object.assign(creatorState.draggingNodeElem.style, {
            left: `${creatorState.nodeOriginalX}px`,
            top: `${creatorState.nodeOriginalY}px`
        })

        Object.assign(creatorState.lastNodeData, {
            x: creatorState.nodeOriginalX + NODE_RADIUS,
            y: creatorState.nodeOriginalY + NODE_RADIUS,
        });

    }

    Object.assign(creatorState, {
        isDraggingNode: false,
        draggingNodeElem: null,
        lastNodeData: null
    })
});