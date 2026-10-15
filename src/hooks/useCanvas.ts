import { useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

import type { CanvasInteraction } from "../types/canvas";

export function useCanvas(
    canvasRef: RefObject<HTMLElement | null>,
    contentRef: RefObject<HTMLElement | null>,
    connectionRef: RefObject<SVGSVGElement | null>,
    interactionObject: CanvasInteraction,
    setCanvasPositionData: Dispatch<SetStateAction<{x: number, y: number}>>,
    setPositionDisplay: Dispatch<SetStateAction<{x: number, y: number}>>
) {

    const {
        dragging,
        wasDragging,
        disableDragging,
        forceDisableDrag,
        mouseDown,
        position,
        lastMousePosition,
        draggedNode
    } = interactionObject;

    useEffect(() => {

        const canvasArea = canvasRef.current;
        const contentArea = contentRef.current;
        const connectionLayer = connectionRef.current;

        if(!canvasArea || !contentArea || !connectionLayer) return;

        const handleMouseMove = (e: MouseEvent) => {
            if(!mouseDown.current) return;
            if(disableDragging.current) return;
            if(draggedNode.current) return;

            const dx = e.clientX - lastMousePosition.current.x;
            const dy = e.clientY - lastMousePosition.current.y;

            const distance = Math.hypot(dx, dy);
            if (distance < 3) return;

            dragging.current = true;
            wasDragging.current = true;

            if(forceDisableDrag.current) return;

            position.current.x += dx;
            position.current.y += dy;

            setPositionDisplay({
                x: position.current.x,
                y: position.current.y
            })

            canvasArea.style.backgroundPosition = `${position.current.x}px ${position.current.y}px`
            contentArea.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
            connectionLayer.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`

            lastMousePosition.current.x = e.clientX;
            lastMousePosition.current.y = e.clientY;
        }

        const handleMouseDown = (e: MouseEvent) => {
            if(draggedNode.current) return;
            if(e.button !== 0) return;
            
            mouseDown.current = true;
            wasDragging.current = false;

            lastMousePosition.current.x = e.clientX;
            lastMousePosition.current.y = e.clientY;
        }

        const handleMouseUp = () => {
            mouseDown.current = false;
            dragging.current = false;
            setCanvasPositionData({x: position.current.x, y: position.current.y});
        }

        const stopDragging = () => {
            dragging.current = false;
            mouseDown.current = false;
            setCanvasPositionData({x: position.current.x, y: position.current.y});
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        canvasArea.addEventListener("mousedown", handleMouseDown);

        window.addEventListener('blur', stopDragging);
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);

        return() => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            canvasArea.removeEventListener("mousedown", handleMouseDown);

            window.removeEventListener('blur', stopDragging);
            window.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('pointercancel', stopDragging);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

}