
export function createLineElement(stroke: string, width: string, x1: string, y1: string, x2: string, y2: string) {
    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", width);

    line.setAttribute("x1", x1)
    line.setAttribute("y1", y1)
    line.setAttribute("x2", x2)
    line.setAttribute("y2", y2)

    return line;
}