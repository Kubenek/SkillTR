function updateZoomTracker() {
    const zoomTR = document.querySelector(".zoom-tracker");
    const zoom = (window.devicePixelRatio / 2).toFixed(2)
    zoomTR.textContent = `${zoom}x`
}

document.addEventListener("wheel", updateZoomTracker);
window.addEventListener("resize", updateZoomTracker);

updateZoomTracker();