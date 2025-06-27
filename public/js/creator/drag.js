import { creatorState } from './creatorState.js'

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector(".canvas-content");
    const creatorArea = document.querySelector(".creator-area")

    let isDragging = false;
    let startX = 0, startY = 0;

    document.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        if (creatorState.disableDrag) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        creatorState.isDraggingNode = false;
        creatorState.draggingNodeElem = null; 

    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        if (creatorState.isDraggingNode) return;
        if (creatorState.isPopupActive) return

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        creatorState.panX += dx;
        creatorState.panY += dy;

        startX = e.clientX;
        startY = e.clientY;

        canvas.style.transform = `translate(${creatorState.panX}px, ${creatorState.panY}px) scale(${creatorState.zoom})`;
        creatorArea.style.backgroundPosition = `${creatorState.panX % 20}px ${creatorState.panY % 20}px`;
    });

    document.addEventListener("selectstart", (e) => {
        if (isDragging) e.preventDefault();
    });
});
