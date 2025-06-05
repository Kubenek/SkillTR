window.panX = 0
window.panY = 0
window.zoom = 1

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector(".canvas-content");
    const creatorArea = document.querySelector(".creator-area")

    let isDragging = false;
    let startX = 0, startY = 0;

    document.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        if (window.isDraggingNode) return;  

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        window.panX += dx;
        window.panY += dy;

        startX = e.clientX;
        startY = e.clientY;

        canvas.style.transform = `translate(${window.panX}px, ${window.panY}px) scale(${window.zoom})`;
        creatorArea.style.backgroundPosition = `${window.panX % 20}px ${window.panY % 20}px`;
    });

    document.addEventListener("selectstart", (e) => {
        if (isDragging) e.preventDefault();
    });
});
