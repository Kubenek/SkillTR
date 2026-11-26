import './Designer.css'
import { CursorPointer, Plus, Move, Link, Trash, Redo, Hand, Block, Edit, Paint, RotateCcw, Eyedropper } from '@boxicons/react';
import React, { useEffect, useRef, useState } from 'react'

import { useCanvas } from '../hooks/useCanvas';
import { usePersistentState } from '../hooks/usePresistentState';
import Navigation from "../components/Navigation"

import { restoreCanvas } from '../utils/restoreEditor';
import { getNodeCenter } from '../utils/geometry';
import { TRI, barycentric, hsvToRgb, pointToHue, hueToRingPoint, pointToSV, svToPoint, hsvToCss, rgbToHex, hexToRgb, rgbToHsv } from '../utils/color';

import { NODE_WIDTH, NODE_HEIGHT } from '../constants/editor';
import { PICKER_CENTER, PICKER_INNER_RADIUS, PICKER_OUTER_RADIUS, PICKER_SIZE } from '../constants/colorPicker';

import type { ConnectionData } from '../types/connection';
import type { NodeData } from '../types/node';
import type { CanvasInteraction } from '../types/canvas';
import type { HSV } from '../types/hsv';

export default function Designer() {

  const dragging = useRef(false);
  const mouseDown = useRef(false);

  const wasDragging = useRef(false);
  const disableDragging = useRef(false);
  const disableTools = useRef(false);

  const lastMousePosition = useRef({x: 0, y:0})
  const position = useRef({x: 0, y: 0})

  const [positionDisplay, setPositionDisplay] = useState<{x: number, y: number}>({x: 0, y: 0})
  
  const [forceDDState, setForceDDState] = usePersistentState<boolean>("DisableDrag", false);
  const forceDisableDrag = useRef<boolean>(forceDDState);

  const [canvasPositionData, setCanvasPositionData] = usePersistentState<{x: number, y: number}>("CanvasPosition", {x: 0, y: 0})
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const connectionLayer = useRef<SVGSVGElement>(null);

  const [activeTool, setActiveTool] = usePersistentState<number>("ActiveTools", 0)

  const draggedNode = useRef<HTMLDivElement | null>(null);
  const mouseDraggingOffset = useRef<{x: number, y: number}>({x: 0, y: 0});

  const [nodes, setNodes] = usePersistentState<NodeData[]>("Nodes", []);
  const [connectionsData, setConnectionsData] = usePersistentState<ConnectionData[]>("Connections", []);

  const [viewedNode, setViewedNode] = useState<HTMLDivElement | null>(null);
  const selectedViewNode = viewedNode 
    ? nodes.find(node => node.NodeUUID === viewedNode.dataset.nodeId)
    : null

  const connectionNode = useRef<HTMLDivElement | null>(null);
  const [lineStart, setLineStart] = useState<{ x: number, y: number } | null>(null);
  const [lineEnd, setLineEnd] = useState<{x: number, y: number} | null>(null);

  const currentColor = useRef<string>("#666");

  const [pickerWindow, setPickerWindow] = useState<boolean>(false);

  const triangleRef = useRef<HTMLCanvasElement>(null);
  const dragZone = useRef<"ring" | "triangle" | null>(null);
  const [hsv, setHsv] = useState<HSV>({h: 0, s: 0, v: 0.4})
  const [inputHEX, setInputHEX] = useState<string>("#");


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

  const toggleDrag = () => {
    setForceDDState(!forceDDState);
  }
  const togglePickerWindow = () => {
    setPickerWindow(!pickerWindow);
  }

  const resetCurrentColor = () => {
    setHsv({h: 0, s: 0, v: 0.4});
  }

  useEffect(() => {
    if(activeTool !== 31) return;
    const canvas = triangleRef.current;
    if(!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(PICKER_SIZE, PICKER_SIZE);
    const { H, W, K } = TRI;
    const [hr, hg, hb] = hsvToRgb(hsv.h, 1, 1);

    for (let y = 0; y < PICKER_SIZE; y++) {
      for (let x = 0; x < PICKER_SIZE; x++) {
        const { a, b, c } = barycentric({ x: x + 0.5, y: y + 0.5 }, H, W, K);
        if (a < 0 || b < 0 || c < 0) continue;

        const i = (y * PICKER_SIZE + x) * 4;
        img.data[i]     = a * hr + b * 255;
        img.data[i + 1] = a * hg + b * 255;
        img.data[i + 2] = a * hb + b * 255;
        img.data[i + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
  }, [hsv.h, pickerWindow, activeTool])

  const handleHEXinputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    input = input.replace(/[^a-fA-F0-9]/g, "");
    input = input.toUpperCase();
    const text = "#" + input;
    setInputHEX(text) 

    const rgb = hexToRgb(text);
    if(rgb) setHsv(prev => rgbToHsv(rgb[0], rgb[1], rgb[2], prev.h));
  }

  const applyPointer = (p: {x: number, y: number}) => {
    if(dragZone.current === "ring") {
      setHsv(prev => ({ ...prev, h: pointToHue(p) }));
    } else if(dragZone.current === "triangle") {
      const { s, v } = pointToSV(p);
      setHsv(prev => ({ ...prev, s: s, v: v}));
    }
  }

  const toLocal = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const k = PICKER_SIZE / r.width;                 
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k }; //? What is the purpose of r and k in these caluclations? Offset?
  };


  const onPickerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = toLocal(e); //? What is the point of toLocal(e)? 
    const dist = Math.hypot(p.x - PICKER_CENTER, p.y - PICKER_CENTER); //? How does calculating the dist work exactly? Pythagoras?
    dragZone.current = 
      dist < PICKER_INNER_RADIUS ? "triangle" :
      dist <= PICKER_OUTER_RADIUS ? "ring" : null

    if(!dragZone.current) return;
    e.currentTarget.setPointerCapture(e.pointerId); //? What does setPointerCapture do? why e.pointerId? What is the return type and its functionality?
    applyPointer(p);
  }

  const onPickerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragZone.current) applyPointer(toLocal(e))
  }

  const onPickerUp = () => { dragZone.current = null; }

  useEffect(() => {
    forceDisableDrag.current = forceDDState;
  }, [forceDDState])

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

      const x = e.clientX - (NODE_WIDTH / 2) - (position.current.x)
      const y = e.clientY - (NODE_HEIGHT / 2) - (position.current.y)

      const nodeData: NodeData = {
        NodeUUID: crypto.randomUUID(),
        Color: "666",
        PositionX: x,
        PositionY: y,
        Title: "NO DATA",
        Cost: 0,
        Category: "undefined",
        Description: "No added description"
      };

      setNodes(prev => [...prev, nodeData]);
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
    }

    const draggingMouseMove = (e: MouseEvent) => {
      if(!(draggedNode.current)) return;

      //?> Dragging selected node

      const x = e.clientX - (position.current.x) - (mouseDraggingOffset.current!.x)
      const y = e.clientY - (position.current.y) - (mouseDraggingOffset.current!.y)

      const id = draggedNode.current.dataset.nodeId;
      setNodes(prev => prev.map(n =>
        n.NodeUUID === id ? {...n, PositionX: x, PositionY: y} : n
      ))

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;

    }

    const draggingMouseUp = () => {

      const dragged = draggedNode.current;
      if (!dragged) return;

      dragged.classList.remove("grabbing");
      dragged.classList.add("grabbable");

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

        const nodeOneID = connectionNode.current.dataset.nodeId!;
        const nodeTwoID = e.target.dataset.nodeId!;

        if(nodeOneID !== nodeTwoID) {
          setConnectionsData(prev => {
            const exists = prev.some(c =>
              (c.SourceUUID === nodeOneID && c.DestinationUUID === nodeTwoID) ||
              (c.SourceUUID === nodeTwoID && c.DestinationUUID === nodeOneID)
            );
            return exists ? prev : [...prev, { SourceUUID: nodeOneID, DestinationUUID: nodeTwoID, Color: "#666" } ]
          })
        }

        //? Variable reset
        contentRef.current?.querySelectorAll(".node").forEach(n => n.classList.remove('selected'))
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

    //!> painting
    const paintingMouseDown = (e: MouseEvent) => {
      const target = e.target;
      if(! ( (target instanceof SVGLineElement) || ( (target instanceof HTMLDivElement) && (target.classList.contains("node")) ) ) ) return;
      
      const { source, dest } = target.dataset;
      const color = currentColor.current;

      if (target instanceof SVGLineElement) {
        setConnectionsData(prev => 
          prev.map(connData =>
            connData.SourceUUID === source && connData.DestinationUUID === dest
              ? {...connData, Color: color}
              : connData
          )
        )
      } else {
        setNodes(prev =>
          prev.map(n =>
            n.NodeUUID === target.dataset.nodeId
              ? {...n, Color: color}
              : n
          )
        )
      }



    }

    //!> node deletion
    const deletingMouseUp = (e: MouseEvent) => {
      if(disableTools.current) return;
      if(wasDragging.current) return;

      if(!( e.target instanceof HTMLDivElement )) return;
      if(!( e.target.classList.contains("node") )) return;

      const deletedID = e.target.dataset.nodeId;
      setNodes( prev => prev.filter(node => node.NodeUUID !== deletedID ));
      setConnectionsData(prev => prev.filter( conn => conn.SourceUUID !== deletedID && conn.DestinationUUID !== deletedID ))
    }

    //!> node view/editing
    const viewingMouseDown = (e: MouseEvent) => {
      if(!( e.target instanceof HTMLDivElement )) return;
      if(!( e.target.classList.contains("node") )) return;

      const nodeElement = e.target;
      const nodeRect = nodeElement.getBoundingClientRect();
      
      setViewedNode(nodeElement)
      
      const posX = Math.round((window.innerWidth / 2) - nodeRect.left - nodeRect.width / 2);
      const posY = Math.round((window.innerHeight / 2) - nodeRect.top - nodeRect.height / 2);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool])

  //?> loading functionality
  useEffect(() => {

    const canvasArea = canvasRef.current;
    const contentArea = contentRef.current;
    const connectionArea = connectionLayer.current;
    if(!canvasArea || !contentArea || !connectionArea) return;

    position.current = restoreCanvas(canvasPositionData, canvasArea, contentArea, connectionArea);

    setPositionDisplay({
      x: position.current.x,
      y: position.current.y
    })

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

  const nodeCursorClass = [0, 3, 4, 5].includes(activeTool) ? "clickable" : activeTool === 2 ? "grabbable" : activeTool === 31 ? "paint-bucket" : "";

  const ringPos = hueToRingPoint(hsv.h);
  const ringBG  = hsvToCss({h: hsv.h, s: 1, v: 1})
  const svPos   = svToPoint(hsv.s, hsv.v);

  const rgbVal = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const hexVal = rgbToHex(rgbVal[0], rgbVal[1], rgbVal[2]);

  useEffect(() => {
    currentColor.current = hexVal;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputHEX(hexVal.toUpperCase());
  }, [hexVal])

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
          <button data-tooltip="View" className={`toolbarItem ${activeTool == 0 ? "active" : ""}`} onClick={() => setActiveTool(0)}> <CursorPointer className='tIcon'/> </button> { /* View */ } 
          <button data-tooltip="Add" className={`toolbarItem ${activeTool == 1 ? "active" : ""}`} onClick={() => setActiveTool(1)}> <Plus className='tIcon'/> </button> { /* Add */ } 
          <button data-tooltip="Move" className={`toolbarItem ${activeTool == 2 ? "active" : ""}`} onClick={() => setActiveTool(2)}> <Move className='tIcon'/> </button> { /* Move */ }
          <button data-tooltip="Connect" className={`toolbarItem ${activeTool == 3 ? "active" : ""}`} onClick={() => setActiveTool(3)}> <Link className='tIcon'/> </button> { /* Connect */ }
          <button data-tooltip="Colorize" className={`toolbarItem ${activeTool == 31 ? "active" : ""}`} onClick={() => setActiveTool(31)}> <Paint className='tIcon'/>  <div className='paintTooltip' style={{backgroundColor: hexVal}}/> </button> { /* Colorize */ } 
          <button data-tooltip="Delete" className={`toolbarItem ${activeTool == 4 ? "active" : ""}`} onClick={() => setActiveTool(4)}> <Trash className='tIcon'/> </button> { /* Delete */ }
          <button data-tooltip="Edit" className={`toolbarItem ${activeTool == 5 ? "active" : ""}`} onClick={() => setActiveTool(5)}> <Edit className='tIcon'/> </button> { /* Edit */ } 
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
            <button onClick={togglePickerWindow} className='item' style={{backgroundColor: "#2b2b3e"}} data-tooltip="Set fill"> <i className='itemIcon'> <i className='color-wheel' /> </i> </button>
          }

        </div>



        { pickerWindow && (activeTool === 31) && 
          <div className='pickerWindow'
            onMouseEnter={() => { disableTools.current = true; disableDragging.current = true; }}
            onMouseLeave={() => { disableTools.current = false; disableDragging.current = false; }}
          >

            <button className='pipette'> <Eyedropper className='icon'/> </button>
            <button className='resetColor' onClick={resetCurrentColor}> <RotateCcw className='icon'/> </button>

            <div className='colorPicker'
                 onPointerDown={onPickerDown}
                 onPointerMove={onPickerMove}
                 onPointerUp={onPickerUp}
                 onPointerCancel={onPickerUp}
            >
              <div className='hueRing'/>
              <canvas className='svTriangle' ref={triangleRef} width={PICKER_SIZE} height={PICKER_SIZE}/>
              <div className='hueDial' style={{ left: ringPos.x, top: ringPos.y, background: ringBG}}/>
              <div className='svDial' style={{ left: svPos.x, top: svPos.y, background: hexVal}}/>
            </div>

            <input type='text' className='hexInput' maxLength={7} value={inputHEX} onChange={handleHEXinputChange} onBlur={() => setInputHEX(hexVal)}/>

          </div>
        }
        

        <section className='canvasArea' ref={canvasRef}>

          <div className='canvasContent' ref={contentRef}>

            { nodes.map(node => (

              <div
                  key={node.NodeUUID}
                  data-node-id={node.NodeUUID}
                  className={`node ${nodeCursorClass}`}
                  style={{ left: node.PositionX, top: node.PositionY, backgroundColor: node.Color }}
              />
              
            ))

            }

          </div>

          <svg className='connectionLayer' ref={connectionLayer}>

            { connectionsData.map(conn => {

              const source      = nodes.find(node => node.NodeUUID === conn.SourceUUID);
              const destination = nodes.find(node => node.NodeUUID === conn.DestinationUUID);
              if(!source || !destination) return null;

              return(
                <line
                    key={`${conn.SourceUUID}-${conn.DestinationUUID}`}
                    className={ (activeTool == 31) ? "paint-bucket" : ""}
                    data-source={ conn.SourceUUID }
                    data-dest={ conn.DestinationUUID }
                    x1={ getNodeCenter(source).x }
                    x2={ getNodeCenter(destination).x }
                    y1={ getNodeCenter(source).y }
                    y2={ getNodeCenter(destination).y }
                    stroke={ conn.Color }
                    strokeWidth={6}
                />
              );

            })}

            { lineStart && lineEnd && (

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

