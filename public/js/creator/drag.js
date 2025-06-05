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
        window.creatorSharedData.isDraggingNode = false;
        window.creatorSharedData.draggingNodeElem = null; 

    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        if (window.creatorSharedData.isDraggingNode) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        window.creatorSharedData.panX += dx;
        window.creatorSharedData.panY += dy;

        startX = e.clientX;
        startY = e.clientY;

        canvas.style.transform = `translate(${window.creatorSharedData.panX}px, ${window.creatorSharedData.panY}px) scale(${window.creatorSharedData.zoom})`;
        creatorArea.style.backgroundPosition = `${window.creatorSharedData.panX % 20}px ${window.creatorSharedData.panY % 20}px`;
    });

    document.addEventListener("selectstart", (e) => {
        if (isDragging) e.preventDefault();
    });
});
