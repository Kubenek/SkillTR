function updateZoomTracker() {
    const zoom = window.outerWidth / window.innerWidth;
    const roundedZoom = zoom.toFixed(1);

    const tracker = document.getElementById("zoom-tracker");
    tracker.textContent = `${roundedZoom}x`;

    tracker.style.transform = `scale(${1 / zoom})`;
}

document.addEventListener("wheel", updateZoomTracker);
window.addEventListener("resize", updateZoomTracker);

updateZoomTracker(); 
