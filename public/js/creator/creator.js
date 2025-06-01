document.addEventListener("DOMContentLoaded", () => {
    const creatorArea = document.querySelector(".creator-area");
    let zoom = 1;
    let panX = 0, panY = 0;

    creatorArea.addEventListener("mousedown", (e) => {
        const { x, y } = getClickPosition(panX, panY, zoom, creatorArea, e);
        e.preventDefault();
        !e.button ? addNodeAtLocation(x, y) : openOptionsMenu(x, y);
    });
});

function getClickPosition(panX, panY, zoom, area, event) {
    const rect = area.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;

    const x = (rawX - panX) / zoom;
    const y = (rawY - panY) / zoom;

    return { x, y };
}

function addNodeAtLocation(x, y) {
    console.log("L Click location: " + x + " " + y);
}

function openOptionsMenu(x, y) {
    console.log("R Click location: " + x + " " + y);
}
