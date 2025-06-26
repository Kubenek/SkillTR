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
                var slCount = creatorState.selectedCount + 1
                creatorState.selectedCount = slCount
                if(slCount == 1) {
                    creatorState.selectNodeFirst = node

                    const line = document.createElement("div")
                    line.classList.add("active-line")
                    canvas.append(line)
                    creatorState.activeLine = line

                    creatorState.mouseMoveHandler = function (e) {
                        const rect = creatorState.selectNodeFirst.getBoundingClientRect();
                        const x1 = rect.left + rect.width / 2;
                        const y1 = rect.top + rect.height / 2;
                        const x2 = e.clientX;
                        const y2 = e.clientY;

                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                        line.style.width = `${length}px`;
                        line.style.left = `${x1}px`;
                        line.style.top = `${y1}px`;
                        line.style.transform = `rotate(${angle}deg)`;
                    };

                    document.addEventListener("mousemove", creatorState.mouseMoveHandler);

                } else if(slCount == 2) {
                    creatorState.selectNodeSecond = node
                    
                    document.removeEventListener("mousemove", creatorState.mouseMoveHandler)
                    creatorState.mouseMoveHandler = null

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

                    creatorState.selectNodeFirst.classList.remove("selected")
                    creatorState.selectNodeSecond.classList.remove("selected")
                    creatorState.selectNodeFirst = null
                    creatorState.selectNodeSecond = null
                    creatorState.selectedCount = 0
                }
            } else if(creatorState.currentItem === "Delete") {

                creatorState.isPopupActive = true;
                
                var popup = document.createElement('div')
                var content = document.createElement('div')

                popup.classList.add("popupContainer")
                content.classList.add("popupBody")

                var p = document.createElement("p")
                p.innerText = "Confirm delete?"

                var yBtn = document.createElement("button")
                var nBtn = document.createElement("button")
                yBtn.classList.add("yBtn"); nBtn.classList.add("nBtn")

                yBtn.innerText = "Yes"; nBtn.innerText = "No"
                
                yBtn.addEventListener("click", () => {
                    node.remove();
                    popup.remove();
                    creatorState.isPopupActive = false;
                    
                    const index = nodes.findIndex(n => n.elem === node) 
                    if(index !== -1) {
                        var lastIndex = nodes.length - 1
                        if(lastIndex !== index) {
                            nodes[index] = nodes[lastIndex]
                        }
                        nodes.pop()
                    }

                })
                nBtn.addEventListener("click", () => {
                    popup.remove();
                    creatorState.isPopupActive = false;
                })

                var popupButtons = document.createElement("div")
                popupButtons.classList.add("popupBtn")

                popupButtons.appendChild(yBtn); popupButtons.appendChild(nBtn)

                content.appendChild(p); content.appendChild(popupButtons)

                popup.appendChild(content)
                document.body.appendChild(popup)
                
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

function updateConnectedLines(movedNode) {
    for(const conn of creatorState.connections) {
        if(conn.fromNode === movedNode || conn.toNode === movedNode) {
            const rect1 = conn.fromNode.getBoundingClientRect();
            const rect2 = conn.toNode.getBoundingClientRect();

            const x1 = rect1.left + rect1.width / 2;
            const y1 = rect1.top + rect1.height / 2;
            const x2 = rect2.left + rect2.width / 2;
            const y2 = rect2.top + rect2.height / 2;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            conn.line.style.width = `${length}px`;
            conn.line.style.left = `${x1}px`;
            conn.line.style.top = `${y1}px`;
            conn.line.style.transform = `rotate(${angle}deg)`;
        }
    }
}
