document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector(".canvas-content");
    const creatorArea = document.querySelector(".creator-area")

    let isDragging = false;
    let startX = 0, startY = 0;
    let panX = 0, panY = 0;
    let zoom = 1;

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

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        panX += dx;
        panY += dy;

        startX = e.clientX;
        startY = e.clientY;

        canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
        creatorArea.style.backgroundPosition = `${panX % 50}px ${panY % 50}px`;
    });

    document.addEventListener("selectstart", (e) => {
        if (isDragging) e.preventDefault();
    });
});
