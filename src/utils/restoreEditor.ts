import { createLineElement } from "./createLineElement";

import { NODE_WIDTH, NODE_HEIGHT } from "../constants/editor";

import type { NodeData } from "../types/node";
import type { Connection, ConnectionData } from "../types/connection";

export function restoreNodes(contentArea: HTMLDivElement, nodes: NodeData[]) {

    contentArea.replaceChildren();
    const nodeVisuals: HTMLDivElement[] = [];

    nodes.forEach(nodeData => {

      const node = document.createElement("div");
      node.classList.add("node")

      node.style.left = `${nodeData.PositionX}px`
      node.style.top  = `${nodeData.PositionY}px`

      node.dataset.nodeId = nodeData.NodeUUID;
      
      contentArea.appendChild(node);
      nodeVisuals.push(node);
    })

    return nodeVisuals;
}

export function restoreConnections(connectionLayer: SVGSVGElement, nodeData: NodeData[], nodeVisuals: HTMLDivElement[], connectionsData: ConnectionData[]) {

    connectionLayer.replaceChildren();
    const connectionVisuals: Connection[] = [];
    connectionsData.forEach(connData => {

      const source      = nodeData.find(node => node.NodeUUID === connData.SourceUUID);
      const destination = nodeData.find(node => node.NodeUUID === connData.DestinationUUID);
      if(!source || !destination) return;

      const sourceElement      = nodeVisuals.find(node => node.dataset.nodeId === source.NodeUUID);
      const destinationElement = nodeVisuals.find(node => node.dataset.nodeId === destination.NodeUUID);
      if(!sourceElement || !destinationElement) return;

      const x1 = source.PositionX + (NODE_WIDTH / 2);
      const y1 = source.PositionY + (NODE_HEIGHT / 2);
      const x2 = destination.PositionX + (NODE_WIDTH / 2);
      const y2 = destination.PositionY + (NODE_HEIGHT / 2);

      const line = createLineElement("#666", "6", String(x1), String(y1), String(x2), String(y2));

      connectionLayer.appendChild(line);
      connectionVisuals.push({From: sourceElement, To: destinationElement, SVG: line});

    })

    return connectionVisuals;
}

export function restoreCanvas(canvasPositionData: {x: number, y: number}, canvasArea: HTMLDivElement, contentArea: HTMLDivElement, connectionLayer: SVGSVGElement) {
    const posX = canvasPositionData.x; const posY = canvasPositionData.y;
    const canvasPosition: {x: number, y: number} = {x: posX, y: posY};

    canvasArea.style.backgroundPosition = `${posX}px ${posY}px`

    contentArea.style.transform         = `translate(${posX}px, ${posY}px)`
    connectionLayer.style.transform      = `translate(${posX}px, ${posY}px)`

    return canvasPosition;
}