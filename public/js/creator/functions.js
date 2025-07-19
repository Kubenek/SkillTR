import { creatorState } from './creatorState.js'
import { COLLISION_RADIUS } from '../config.js';
import { removeElementFromList } from '../QoL.js'

// * Overlap Logic
export function nodesOverlap(currentNode) {

    for (const other of creatorState.nodes) {
        if (other === currentNode) continue;

        if (circlesOverlap(currentNode.x, currentNode.y, other.x, other.y)) {
            return true;
        }
    }
    return false;
}

export function circlesOverlap(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < COLLISION_RADIUS;
}
// * ===========================



// * Connection lines position logic
export function updateConnectedLines(movedNode) {
    for(const conn of creatorState.connections) {
        if(conn.fromNode === movedNode || conn.toNode === movedNode) {
            const rect1 = conn.fromNode.getBoundingClientRect();
            const rect2 = conn.toNode.getBoundingClientRect();

            updateLinePosition(conn.line, rect1, rect2)
        }
    }
}

export function updateConnectionLinesPositions() {
    for (const conn of creatorState.connections)  {
        const nodeA = conn.fromNode;
        const nodeB = conn.toNode;

        updateLinePosition(conn.line, nodeA, nodeB)
    }
}

export function updateActiveLinePos(mouseX, mouseY) { // ? Active Lines
    if (!creatorState.activeLine || !creatorState.selectNodeFirst) return;

    const fromNode = creatorState.selectNodeFirst;

    updateLinePosition(creatorState.activeLine, fromNode, {x: mouseX, y: mouseY})
}

function getCenter(obj) {
    if ("offsetLeft" in obj && "offsetWidth" in obj) {
        return {
            x: obj.offsetLeft + obj.offsetWidth / 2,
            y: obj.offsetTop + obj.offsetHeight / 2
        };
    } else if ("left" in obj && "width" in obj) {
        return {
            x: obj.left + obj.width / 2,
            y: obj.top + obj.height / 2
        };
    } else if ("x" in obj && "y" in obj) {
        return { x: obj.x, y: obj.y };
    } else {
        throw new Error("Invalid object passed to getCenter");
    }
}


export function updateLinePosition(line, objA, objB) {

    let p1 = getCenter(objA)
    let p2 = getCenter(objB)

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    line.style.width = `${length}px`;
    line.style.left = `${p1.x}px`;
    line.style.top = `${p1.y}px`;
    line.style.transform = `rotate(${angle}deg)`;
}

// * =========================================


// * Misc Functions
export function resetSelectData() {
    creatorState.selectNodeFirst.classList.remove("selected")
    creatorState.selectNodeSecond.classList.remove("selected")
    creatorState.selectNodeFirst = null
    creatorState.selectNodeSecond = null
    creatorState.selectedCount = 0
    creatorState.activeLine = null
}

export function getMousePosRelativeToCanvas(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

export function deleteConnections(deletedNode) {
    creatorState.connections.forEach(conn => {
        if (conn.fromNode === deletedNode || conn.toNode === deletedNode) {
            conn.line.remove();
        }
    });
    creatorState.connections = creatorState.connections.filter(conn => 
        conn.fromNode !== deletedNode && conn.toNode !== deletedNode
    );
}

export function getClickPosition(area, event) {
    const rect = area.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;

    const x = (rawX - creatorState.panX) / creatorState.zoom;
    const y = (rawY - creatorState.panY) / creatorState.zoom;

    return { x, y };
}

export function createDeletePopup(node) {
    creatorState.isPopupActive = true

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
        deleteConnections(node)
        node.remove(); popup.remove();
        creatorState.isPopupActive = false;
        removeElementFromList(creatorState.nodes, node)
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
}
 
