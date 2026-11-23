
export function restoreCanvas(canvasPositionData: {x: number, y: number}, canvasArea: HTMLDivElement, contentArea: HTMLDivElement, connectionLayer: SVGSVGElement) {
    const posX = canvasPositionData.x; const posY = canvasPositionData.y;
    const canvasPosition: {x: number, y: number} = {x: posX, y: posY};

    canvasArea.style.backgroundPosition = `${posX}px ${posY}px`

    contentArea.style.transform         = `translate(${posX}px, ${posY}px)`
    connectionLayer.style.transform      = `translate(${posX}px, ${posY}px)`

    return canvasPosition;
}