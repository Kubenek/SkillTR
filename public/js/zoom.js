function updateZoomTracker() {
    const zoomTR = document.querySelector(".zoom-tracker");
    const zoom = (window.devicePixelRatio / 2).toFixed(2)
    zoomTR.textContent = `${zoom}x`
}

document.addEventListener("wheel", updateZoomTracker);
window.addEventListener("resize", updateZoomTracker);

updateZoomTracker();

function lockToolbar() {
    const nav = document.querySelector(".nav");

    if (!nav) return;

    const zoom = window.devicePixelRatio;
    const invertScale = 1.5 / zoom

    nav.style.transform = `translateX(-50%) scale(${invertScale})`
}

window.addEventListener('load', lockToolbar);
window.addEventListener('resize', lockToolbar)