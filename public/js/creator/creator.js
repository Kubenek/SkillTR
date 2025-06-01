let nodeClicked = false;
let nodes = [];
const NODE_RADIUS = 15;
const COLLISION_MARGIN = 0;
const COLLISION_RADIUS = NODE_RADIUS + COLLISION_MARGIN;
let clickStartTime = 0;
let clickStartPos = {x:0, y: 0}
const CLICK_TIME_THRESHOLD = 200
const CLICK_MOVE_THRESHOLD = 5

document.addEventListener("DOMContentLoaded", () => {
    const creatorArea = document.querySelector(".creator-area");
    const canvas = document.querySelector(".canvas-content");

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
            !e.button ? addNodeAtLocation(canvas, x, y) : alert("xd")
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
        node.addEventListener("mousedown", () => {
            //nodeClicked = true; add later when doing options menu
        });
    }
}


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
