import { creatorState } from './creatorState.js'
import { COLLISION_RADIUS } from '../config.js';

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

export function updateConnectionLinesPositions() {
    for (const conn of creatorState.connections)  {
        const nodeA = conn.fromNode;
        const nodeB = conn.toNode;

        const ax = nodeA.offsetLeft + nodeA.offsetWidth / 2;
        const ay = nodeA.offsetTop + nodeA.offsetHeight / 2;
        const bx = nodeB.offsetLeft + nodeB.offsetWidth / 2;
        const by = nodeB.offsetTop + nodeB.offsetHeight / 2;

        const x1 = ax;
        const y1 = ay;
        const x2 = bx;
        const y2 = by;

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

export function updateActiveLinePos(mouseX, mouseY) { // ? Active Lines
    if (!creatorState.activeLine || !creatorState.selectNodeFirst) return;

    const fromNode = creatorState.selectNodeFirst;
    const x1 = fromNode.offsetLeft + fromNode.offsetWidth / 2;
    const y1 = fromNode.offsetTop + fromNode.offsetHeight / 2;

    const x2 = mouseX;
    const y2 = mouseY;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const line = creatorState.activeLine;
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
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


