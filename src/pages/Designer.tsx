import './Designer.css'
import { CursorPointer, Plus, Move, Link, Trash, Redo, Hand, Block, Edit, Paint } from '@boxicons/react';
import { useEffect, useRef, useState } from 'react'

import { useCanvas } from '../hooks/useCanvas';
import Navigation from "../components/Navigation"

import { createLineElement } from '../utils/createLineElement';
import { restoreNodes, restoreConnections, restoreCanvas } from '../utils/restoreEditor';

import { NODE_WIDTH, NODE_HEIGHT } from '../constants/editor';

import type { Connection, ConnectionData } from '../types/connection';
import type { NodeData } from '../types/node';
import type { CanvasInteraction } from '../types/canvas';

export default function Designer() {

  const dragging = useRef(false);
  const mouseDown = useRef(false);

  const wasDragging = useRef(false);
  const disableDragging = useRef(false);
  const disableTools = useRef(false);

  const lastMousePosition = useRef({x: 0, y:0})
  const position = useRef({x: 0, y: 0})

  const [positionDisplay, setPositionDisplay] = useState<{x: number, y: number}>({x: 0, y: 0})
  
  const [forceDDState, setForceDDState] = useState<boolean>(() => {
    const saved = localStorage.getItem("DisableDrag");

    try {
      const loadedState: boolean = (saved === null) ? false : JSON.parse(saved);
      return loadedState
    } catch {
      return false;
    }
  });
  const forceDisableDrag = useRef<boolean>(forceDDState);

  const [canvasPositionData, setCanvasPositionData] = useState<{x: number, y: number}>(() => {
    const saved = localStorage.getItem("CanvasPosition");

    try {
      const loadedPosition: { x: number, y: number } = (saved === null) ? { x: 0, y: 0 } : JSON.parse(saved);
      return loadedPosition;
    } catch {
      return {x: 0, y: 0}
    }

  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const connectionLayer = useRef<SVGSVGElement>(null);

  const [activeTool, setActiveTool] = useState<number>(() => {
    
    const saved = localStorage.getItem("ActiveTools");
    if(saved === null) return 0;
    return Number(saved);

  });

  const draggedNode = useRef<HTMLDivElement | null>(null);
  const mouseDraggingOffset = useRef<{x: number, y: number}>({x: 0, y: 0});

  const [nodes, setNodes] = useState<NodeData[]>(() => {

    const saved = localStorage.getItem("Nodes");
    if(saved === null) return [];

    try   { return JSON.parse(saved) as NodeData[]; }
    catch { return []; }

  })

  const [connectionsData, setConnectionsData] = useState<ConnectionData[]>(() => {
    
    const saved = localStorage.getItem("Connections");
    if(saved === null) return [];

    try   { return JSON.parse(saved) as ConnectionData[]; }
    catch { return []; }

  })

  const [viewedNode, setViewedNode] = useState<HTMLDivElement | null>(null);
  const selectedViewNode = viewedNode 
    ? nodes.find(node => node.NodeUUID === viewedNode.dataset.nodeId)
    : null

  const connectionNode = useRef<HTMLDivElement | null>(null);
  const [lineStart, setLineStart] = useState<{ x: number, y: number } | null>(null);
  const [lineEnd, setLineEnd] = useState<{x: number, y: number} | null>(null);

  const connectionVisuals = useRef<Connection[]>([]);
  const nodeVisuals = useRef<HTMLDivElement[]>([]);
  const draggedConnections = useRef<Connection[] | null>(null);

  const currentColor = useRef<string>("#666");
  const [colorWheel, setColorWheel] = useState<boolean>(false);
  const [colorDisplay, setColorDisplay] = useState<string>("#666");

  const dialRef = useRef<HTMLDivElement | null>(null);
  const [dialPosition, setDialPosition] = useState<{ x: number, y: number }>({x: 0, y: 0});


  const canvasInteraction: CanvasInteraction = {
    dragging,
    wasDragging,
    disableDragging,
    forceDisableDrag,
    mouseDown,
    position,
    lastMousePosition,
    draggedNode
  }

  const handleToolOnClick = (id: number) => {
    setActiveTool(id);

    nodeVisuals.current.forEach(node =>
      node.classList.remove("clickable", "grabbable")
    )

    connectionVisuals.current.forEach(connData =>
      connData.SVG.classList.remove("paint-bucket")
    )

    if(id === 0 || id === 3 || id === 4 || id === 5) {
      nodeVisuals.current.forEach(node =>
        node.classList.add("clickable")
      )
    } else if(id === 2) {
      nodeVisuals.current.forEach(node =>
        node.classList.add("grabbable")
      )
    } else if(id === 31) {
      connectionVisuals.current.forEach(connData =>
        connData.SVG.classList.add("paint-bucket")
      )
    }

    localStorage.setItem("ActiveTools", String(id));
  }

  const handleResetView = () => {

    const ANIM_TIME = 250

    contentRef.current!.style.transition =  `transform ${ANIM_TIME}ms ease-in-out`;
    connectionLayer.current!.style.transition =  `transform ${ANIM_TIME}ms ease-in-out`;
    canvasRef.current!.style.transition = `background-position ${ANIM_TIME}ms ease-in-out`;

    position.current = {x: 0, y: 0};
    setPositionDisplay(position.current);
    setCanvasPositionData(position.current)
    setViewedNode(null);

    canvasRef.current!.style.backgroundPosition = `${position.current.x}px ${position.current.y}px`
    contentRef.current!.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
    connectionLayer.current!.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`

    setTimeout(() => {
      canvasRef.current!.style.transition = "none";
      contentRef.current!.style.transition = "none";
      connectionLayer.current!.style.transition = "none";
    }, ANIM_TIME);

  }

  const handleColorSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;

    const hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360 + 90) % 360;
    
    const color = `hsl(${hue}, 100%, 50%)`

    setColorDisplay(color);

    setDialPosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100
    });
};

  const toggleDrag = () => {
    setForceDDState(!forceDDState);
  }
  const toggleColorWheel = () => {
    setColorWheel(!colorWheel);
  }

  useEffect(() => {
    forceDisableDrag.current = forceDDState;
  }, [forceDDState])

  useEffect(() => {
    currentColor.current = colorDisplay;
  }, [colorDisplay])

  //?> toolbar functions
  useEffect(() => {

    const handleMouseDown = (e: MouseEvent) => {
      if(disableTools.current) return;

      if(activeTool == 0) viewingMouseDown(e);
      if(activeTool == 2) draggingMouseDown(e);
      if(activeTool == 3) connectingMouseDown(e);
      if(activeTool == 31) paintingMouseDown(e);
      
    }

    const handleMouseMove = (e: MouseEvent) => {

      if(disableTools.current) return;
      
      if(activeTool === 2) draggingMouseMove(e);
      if(activeTool === 3) connectingMouseMove(e);

    }

    const handleMouseUp = (e: MouseEvent) => {

      if(disableTools.current) return;

      if(activeTool === 1) handleNodeAddition(e);
      if(activeTool === 2) draggingMouseUp();
      if(activeTool === 4) deletingMouseUp(e);

      //! Reset Parameters
      draggedConnections.current = null;
      disableDragging.current = false;
      dragging.current = false;
      draggedNode.current = null;
      mouseDraggingOffset.current = {x: 0, y: 0};

    }

    //!> node addition
    const handleNodeAddition = (e: MouseEvent) => {
      if(disableTools.current) return;
      if(wasDragging.current) return;

      if(e.target instanceof HTMLDivElement && e.target.classList.contains("node")) return;

      const node = document.createElement("div")
      node.classList.add("node")

      const x = e.clientX - (NODE_WIDTH / 2) - (position.current.x)
      const y = e.clientY - (NODE_HEIGHT / 2) - (position.current.y)

      node.style.left = `${x}px`
      node.style.top  = `${y}px`

      const nodeData: NodeData = {
        NodeUUID: crypto.randomUUID(),
        PositionX: x,
        PositionY: y,
        Title: "NO DATA",
        Cost: 0,
        Category: "undefined",
        Description: "No added description"
      };

      node.dataset.nodeId = nodeData.NodeUUID;

      setNodes(prev => [...prev, nodeData]);
      nodeVisuals.current.push(node);

      contentRef.current?.appendChild(node);
    }

    //!> node dragging
    const draggingMouseDown = (e: MouseEvent) => {
      if(! (e.target instanceof HTMLDivElement) ) return;
      if(! (e.target.classList.contains("node")) ) return;

      disableDragging.current = true;
      draggedNode.current = e.target;

      draggedNode.current.classList.remove("grabbable");
      draggedNode.current.classList.add("grabbing");

      const nodeRect = draggedNode.current.getBoundingClientRect();
      
      const offsetX = e.clientX - nodeRect.left;
      const offsetY = e.clientY - nodeRect.top;

      mouseDraggingOffset.current = {x: offsetX, y: offsetY}

      const nodeConnections = connectionVisuals.current.filter((connection) => 
        connection.From === draggedNode.current ||
        connection.To === draggedNode.current
      )

      draggedConnections.current = (nodeConnections.length > 0) ? nodeConnections : null; 

    }

    const draggingMouseMove = (e: MouseEvent) => {
      if(!(draggedNode.current)) return;

      //?> Dragging selected node

      const x = e.clientX - (position.current.x) - (mouseDraggingOffset.current!.x)
      const y = e.clientY - (position.current.y) - (mouseDraggingOffset.current!.y)

      draggedNode.current!.style.left = `${x}px`
      draggedNode.current!.style.top = `${y}px`

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;

      //?> Moving connection lines

      if(draggedConnections.current === null) return;

      const rootNode = draggedNode.current;
      const svgRect = connectionLayer.current!.getBoundingClientRect();

      draggedConnections.current.forEach(connection => {
        if(connection.From === rootNode) { 

          const posX = rootNode.getBoundingClientRect().left + ( NODE_WIDTH / 2 ) - svgRect.left;
          const posY = rootNode.getBoundingClientRect().top + ( NODE_HEIGHT / 2 ) - svgRect.top;

          connection.SVG.setAttribute("x1", String(posX));
          connection.SVG.setAttribute("y1", String(posY));

        }
        else if(connection.To === rootNode) {

          const posX = rootNode.getBoundingClientRect().left + ( NODE_WIDTH / 2 ) - svgRect.left;
          const posY = rootNode.getBoundingClientRect().top + ( NODE_HEIGHT / 2 ) - svgRect.top;

          connection.SVG.setAttribute("x2", String(posX));
          connection.SVG.setAttribute("y2", String(posY));

        }
      })

    }

    const draggingMouseUp = () => {

      const dragged = draggedNode.current;
      if (!dragged) return;

      const nodeId = dragged.dataset.nodeId;
      if (!nodeId) return;

      dragged.classList.remove("grabbing");
      dragged.classList.add("grabbable");

      const x = parseFloat(dragged.style.left);
      const y = parseFloat(dragged.style.top);

      setNodes(prev =>
        prev.map(node =>
          node.NodeUUID === nodeId
            ? { ...node, PositionX: x, PositionY: y }
            : node
        )
      );

    }

    //!> node connection
    const connectingMouseDown = (e: MouseEvent) => {
      if(! (e.target instanceof HTMLDivElement) ) return;
      if(! (e.target.classList.contains("node")) ) return;

      const svgRect = connectionLayer.current!.getBoundingClientRect();

      if(connectionNode.current === null) {

        const currentNode = e.target;
        currentNode.classList.add("selected");

        connectionNode.current = currentNode;
        disableDragging.current = true;

        const nodeRect = currentNode.getBoundingClientRect();

        setLineStart({
          x: nodeRect.left + NODE_WIDTH / 2 - svgRect.left,
          y: nodeRect.top + NODE_HEIGHT / 2 - svgRect.top
        });

      } else {

        const nodeOne = connectionNode.current;
        const nodeTwo = e.target;

        const exists = connectionVisuals.current.some(
          connection => 
            (connection.From === nodeOne && connection.To === nodeTwo) ||
            (connection.From === nodeTwo && connection.To === nodeOne) ||
            (nodeOne === nodeTwo)
        );

        if(exists) {
          const nodes = contentRef.current?.querySelectorAll(".node");

          nodes?.forEach(node => {
            node.classList.remove('selected');
          })

          connectionNode.current = null;
          setLineStart(null); setLineEnd(null);

          return;
        }

        const onePosX = nodeOne.getBoundingClientRect().left + ( NODE_WIDTH / 2 ) - svgRect.left;
        const onePosY = nodeOne.getBoundingClientRect().top + ( NODE_HEIGHT / 2 ) - svgRect.top;

        const twoPosX = nodeTwo.getBoundingClientRect().left + ( NODE_WIDTH / 2 ) - svgRect.left;
        const twoPosY = nodeTwo.getBoundingClientRect().top + ( NODE_HEIGHT / 2 ) - svgRect.top;

        //?> Line Creation
        const line = createLineElement("#666", "6", String(onePosX), String(onePosY), String(twoPosX), String(twoPosY))

        connectionLayer.current?.appendChild(line);
        connectionVisuals.current.push({From: nodeOne, To: nodeTwo, SVG: line});
        
        const connData: ConnectionData = {
          SourceUUID: nodeOne.dataset.nodeId!,
          DestinationUUID: nodeTwo.dataset.nodeId!,
          Color: "#666"
        }

        setConnectionsData(prev => [...prev, connData]);

        //? Variable reset
        const nodes = contentRef.current?.querySelectorAll(".node");

        nodes?.forEach(node => {
          node.classList.remove('selected');
        })

        connectionNode.current = null;
        setLineStart(null); setLineEnd(null);

      }

    }

    const connectingMouseMove = (e: MouseEvent) => {
      if(activeTool !== 3) return;

      const svgRect = connectionLayer.current!.getBoundingClientRect();

      const posX = e.clientX - svgRect.left;
      const posY = e.clientY - svgRect.top;

      setLineEnd({x: posX, y: posY});

    }

    //!> connection painting
    const paintingMouseDown = (e: MouseEvent) => {
      const target = e.target;
      if(! (target instanceof SVGLineElement) ) return;

      const color = currentColor.current;
      target.setAttribute("stroke", color);

      const lineVis = connectionVisuals.current.find(connData => connData.SVG === target)!;
      setConnectionsData(prev => 
        prev.map(connData =>
          connData.SourceUUID === lineVis.From.dataset.nodeId && connData.DestinationUUID === lineVis.To.dataset.nodeId
            ? {...connData, Color: color}
            : connData
        )
      )
    }

    //!> node deletion
    const deletingMouseUp = (e: MouseEvent) => {
      if(disableTools.current) return;
      if(wasDragging.current) return;

      if(!( e.target instanceof HTMLDivElement )) return;
      if(!( e.target.classList.contains("node") )) return;

      const deletedNode = e.target;

      contentRef.current?.removeChild(e.target);
      nodeVisuals.current = nodeVisuals.current.filter(node => node.dataset.nodeId !== deletedNode.dataset.nodeId);
      setNodes(prev => prev.filter(node => node.NodeUUID !== deletedNode.dataset.nodeId));

      const deletedConnections = connectionVisuals.current.filter(conn =>
        conn.From === deletedNode || conn.To === deletedNode
      );
      deletedConnections.forEach(conn => connectionLayer.current?.removeChild(conn.SVG));

      connectionVisuals.current = connectionVisuals.current.filter(conn => !deletedConnections.includes(conn));
      setConnectionsData(prev => prev.filter(conn => 
        conn.SourceUUID !== deletedNode.dataset.nodeId && conn.DestinationUUID !== deletedNode.dataset.nodeId
      ))


    }

    //!> node view/editing
    const viewingMouseDown = (e: MouseEvent) => {
      if(!( e.target instanceof HTMLDivElement )) return;
      if(!( e.target.classList.contains("node") )) return;

      const nodeElement = e.target;
      const nodeRect = nodeElement.getBoundingClientRect();
      
      setViewedNode(nodeElement)
      
      const posX = Math.round((window.innerWidth / 2) - nodeRect.left - nodeRect.width / 2);
      const posY = Math.round((window.innerHeight / 2) - nodeRect.top - nodeRect.width / 2);

      position.current.x += posX;
      position.current.y += posY;  

      setPositionDisplay({
          x: position.current.x,
          y: position.current.y
      })

      const ANIM_TIME = 250

      contentRef.current!.style.transition =  `transform ${ANIM_TIME}ms ease-in-out`;
      connectionLayer.current!.style.transition =  `transform ${ANIM_TIME}ms ease-in-out`;
      canvasRef.current!.style.transition = `background-position ${ANIM_TIME}ms ease-in-out`;

      canvasRef.current!.style.backgroundPosition = `${position.current.x}px ${position.current.y}px`
      contentRef.current!.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
      connectionLayer.current!.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`

      setTimeout(() => {
        canvasRef.current!.style.transition = "none";
        contentRef.current!.style.transition = "none";
        connectionLayer.current!.style.transition = "none";
      }, ANIM_TIME);

    }

    const canvas = canvasRef.current!;

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove)

    return() => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };

  }, [activeTool])

  //?> Saving functionalities
  useEffect(() => {
    localStorage.setItem("Nodes", JSON.stringify(nodes));
    localStorage.setItem("Connections", JSON.stringify(connectionsData));
    localStorage.setItem("CanvasPosition", JSON.stringify(canvasPositionData));
    localStorage.setItem("DisableDrag", JSON.stringify(forceDDState));
  }, [nodes, connectionsData, canvasPositionData, forceDDState]);

  //?> loading functionality
  useEffect(() => {

    const canvasArea = canvasRef.current;
    const contentArea = contentRef.current;
    const connectionArea = connectionLayer.current;
    if(!canvasArea || !contentArea || !connectionArea) return;

    nodeVisuals.current = restoreNodes(contentArea, nodes);
    connectionVisuals.current = restoreConnections(connectionArea, nodes, nodeVisuals.current, connectionsData);
    position.current = restoreCanvas(canvasPositionData, canvasArea, contentArea, connectionArea);

    setPositionDisplay({
      x: position.current.x,
      y: position.current.y
    })

    handleToolOnClick(activeTool);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useCanvas(
    canvasRef,
    contentRef,
    connectionLayer,
    canvasInteraction,
    setCanvasPositionData,
    setPositionDisplay,
    setViewedNode
  )

  return (
    <>
      <section className='siteContainer'>

        <div className='nodeInformation'>
          <p className='title'>{(selectedViewNode) ? selectedViewNode.Title : "NO NODE SELECTED"}</p>
          <hr/>

          { selectedViewNode &&
          <div className='itemGroup'>
            <p className='cost'>{selectedViewNode.Cost} SKILL POINTS</p>
            <p className='category'>{selectedViewNode.Category}</p>
          </div>
          } 

          <p className='description' style={{ marginTop: selectedViewNode ? "10px" : "0px" }}>
            {(selectedViewNode) ? selectedViewNode.Description : "Use \"View\" or \"Edit\" tool to select one"}
          </p>
        </div>

        <div className='editorToolbar' 
          onMouseEnter={() => {disableTools.current = true; disableDragging.current = true}}
          onMouseLeave={() => {disableTools.current = false; disableDragging.current = false}}
        >
          <button data-tooltip="View" className={`toolbarItem ${activeTool == 0 ? "active" : ""}`} onClick={() => handleToolOnClick(0)}> <CursorPointer className='tIcon'/> </button> { /* View */ } 
          <button data-tooltip="Add" className={`toolbarItem ${activeTool == 1 ? "active" : ""}`} onClick={() => handleToolOnClick(1)}> <Plus className='tIcon'/> </button> { /* Add */ } 
          <button data-tooltip="Move" className={`toolbarItem ${activeTool == 2 ? "active" : ""}`} onClick={() => handleToolOnClick(2)}> <Move className='tIcon'/> </button> { /* Move */ }
          <button data-tooltip="Connect" className={`toolbarItem ${activeTool == 3 ? "active" : ""}`} onClick={() => handleToolOnClick(3)}> <Link className='tIcon'/> </button> { /* Connect */ }
          <button data-tooltip="Colorize" className={`toolbarItem ${activeTool == 31 ? "active" : ""}`} onClick={() => handleToolOnClick(31)}> <Paint className='tIcon'/> </button> { /* Colorize */ } 
          <button data-tooltip="Delete" className={`toolbarItem ${activeTool == 4 ? "active" : ""}`} onClick={() => handleToolOnClick(4)}> <Trash className='tIcon'/> </button> { /* Delete */ }
          <button data-tooltip="Edit" className={`toolbarItem ${activeTool == 5 ? "active" : ""}`} onClick={() => handleToolOnClick(5)}> <Edit className='tIcon'/> </button> { /* Edit */ } 
       </div>

        <div className='canvasCoordinates'>
          X: {positionDisplay.x * -1}<br/>
          Y: {positionDisplay.y}
        </div>

        <Navigation/>

        <div className='additionalTools'
          onMouseEnter={() => {disableTools.current = true; disableDragging.current = true}}
          onMouseLeave={() => {disableTools.current = false; disableDragging.current = false}}
        >
          <button onClick={handleResetView} className='item' data-tooltip="Reset view"> <Redo className='itemIcon'/> </button>
          <button className={`item ${forceDDState ? "disabled" : ""}`} onClick={toggleDrag} data-tooltip={`${forceDDState ? "Enable drag" : "Disable drag"} `}>
            { !forceDDState && <Hand className='itemIcon'/> }
            { forceDDState && <Block className='itemIcon'/> }
          </button>

          { activeTool === 31 &&
            <button onClick={toggleColorWheel} className='item' style={{backgroundColor: "#2b2b3e"}} data-tooltip="Set fill"> <i className='itemIcon'> <i className='color-wheel' /> </i> </button>
          }

        </div>

        { colorWheel &&
          <div className='colorWheelWindow'
            onMouseEnter={() => { disableTools.current = true; disableDragging.current = true; }}
            onMouseLeave={() => { disableTools.current = false; disableDragging.current = false; }}
          >

            <div className='colorWheel' onClick={handleColorSelect}>
              <div className='colorDial' style={{ left: `${dialPosition.x}%`, top: `${dialPosition.y}%` }} ref={dialRef}/>
            </div>

          </div>
        }
        

        <section className='canvasArea' ref={canvasRef}>
          <div className='canvasContent' ref={contentRef}></div>

          <svg className='connectionLayer' ref={connectionLayer}>
              {lineStart && lineEnd && (
                <line
                      x1={lineStart.x} y1={lineStart.y}
                      x2={lineEnd.x}   y2={lineEnd.y}
                      stroke="#666"
                />
              )}
            </svg>

        </section>

      </section>
    </>
  )
}

