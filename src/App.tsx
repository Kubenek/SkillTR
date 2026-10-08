import './App.css'
import { CursorPointer, Plus, Move, Link, Trash } from '@boxicons/react';
import { useEffect, useRef, useState } from 'react'

function App() {

  const dragging = useRef(false);
  const mouseDown = useRef(false);

  const wasDragging = useRef(false);
  const disableDragging = useRef(false);
  const disableTools = useRef(false);
  
  const position = useRef({x: 0, y: 0})
  const lastMousePosition = useRef({x: 0, y:0})

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const connectionLayer = useRef<SVGSVGElement>(null);

  const [activeTool, setActiveTool] = useState<number | null>(0);

  const draggedNode = useRef<HTMLDivElement | null>(null);
  const mouseDraggingOffset = useRef<{x: number, y: number}>({x: 0, y: 0});

  const connectionNode = useRef<HTMLDivElement | null>(null);
  const [lineStart, setLineStart] = useState<{ x: number, y: number } | null>(null);
  const [lineEnd, setLineEnd] = useState<{x: number, y: number} | null>(null);

  const NODE_HEIGHT = 50;
  const NODE_WIDTH = 50;

  const handleToolOnClick = (id: number) => {
    setActiveTool(id);
  }

  // toolbar functions
  useEffect(() => {

    const handleMouseDown = (e: MouseEvent) => {
      if(disableTools.current) return;

      if(activeTool == 2) draggingMouseDown(e);
      if(activeTool == 3) connectingMouseDown(e);
      
    }

    const handleMouseMove = (e: MouseEvent) => {

      if(disableTools.current) return;
      
      if(activeTool === 2) draggingMouseMove(e);
      if(activeTool === 3) connectingMouseMove(e);

    }

    const handleMouseUp = (e: MouseEvent) => {

      handleNodeAddition(e);

      disableDragging.current = false;
      dragging.current = false;
      draggedNode.current = null;
      mouseDraggingOffset.current = {x: 0, y: 0};

    }

    // node addition
    const handleNodeAddition = (e: MouseEvent) => {
      if(activeTool !== 1) return;
      if(disableTools.current) return;
      if(wasDragging.current) return;

      const node = document.createElement("div")
      node.classList.add("node")

      node.style.left = `${e.clientX - (NODE_WIDTH / 2) - (position.current.x) }px`
      node.style.top = `${e.clientY - (NODE_HEIGHT / 2) - (position.current.y) }px`

      contentRef.current?.appendChild(node)
    }

    // node dragging
    const draggingMouseDown = (e: MouseEvent) => {
      if(! (e.target instanceof HTMLDivElement) ) return;
      if(! (e.target.classList.contains("node")) ) return;

      disableDragging.current = true;
      draggedNode.current = e.target;

      const nodeRect = draggedNode.current.getBoundingClientRect();
      
      const offsetX = e.clientX - nodeRect.left;
      const offsetY = e.clientY - nodeRect.top;

      mouseDraggingOffset.current = {x: offsetX, y: offsetY}
    }

    const draggingMouseMove = (e: MouseEvent) => {
      if(activeTool !== 2) return;
      if(!(draggedNode.current)) return;

      draggedNode.current!.style.left = `${e.clientX - (position.current.x) - (mouseDraggingOffset.current!.x) }px`
      draggedNode.current!.style.top = `${e.clientY - (position.current.y) - (mouseDraggingOffset.current!.y) }px`

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;
    }

    // node connection
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

        const onePosX = nodeOne.getBoundingClientRect().left + ( NODE_WIDTH / 2 ) - svgRect.left;
        const onePosY = nodeOne.getBoundingClientRect().top + ( NODE_HEIGHT / 2 ) - svgRect.top;

        const twoPosX = nodeTwo.getBoundingClientRect().left + ( NODE_WIDTH / 2 ) - svgRect.left;
        const twoPosY = nodeTwo.getBoundingClientRect().top + ( NODE_HEIGHT / 2 ) - svgRect.top;

        //? Line Creation
        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("stroke", "#666");
        line.setAttribute("stroke-width", "6");

        line.setAttribute("x1", String(onePosX))
        line.setAttribute("y1", String(onePosY))
        line.setAttribute("x2", String(twoPosX))
        line.setAttribute("y2", String(twoPosY))

        connectionLayer.current?.appendChild(line);

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


  // dragging functionality
  useEffect(() => {

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

      position.current!.x += dx;
      position.current!.y += dy;

      canvasRef.current!.style.backgroundPosition = `${position.current!.x}px ${position.current!.y}px`
      contentRef.current!.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;
    }

    const handleMouseDown = (e: MouseEvent) => {
      if(draggedNode.current) return;
      
      mouseDown.current = true;
      wasDragging.current = false;

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;
    }

    const handleMouseUp = () => {
      mouseDown.current = false;
      dragging.current = false;
    }

    const canvas = canvasRef.current!;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousedown", handleMouseDown);

    return() => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };

  }, [])

  return (
    <>
      <section className='siteContainer'>

        <div className='editorToolbar' 
          onMouseEnter={() => {disableTools.current = true; disableDragging.current = true}}
          onMouseLeave={() => {disableTools.current = false; disableDragging.current = false}}
        >
          <button className={`toolbarItem ${activeTool == 0 ? "active" : ""}`} onClick={() => handleToolOnClick(0)}> <CursorPointer className='tIcon'/> </button> { /* View */ } 
          <button className={`toolbarItem ${activeTool == 1 ? "active" : ""}`} onClick={() => handleToolOnClick(1)}> <Plus className='tIcon'/> </button> { /* Add */ } 
          <button className={`toolbarItem ${activeTool == 2 ? "active" : ""}`} onClick={() => handleToolOnClick(2)}> <Move className='tIcon'/> </button> { /* Move */ }
          <button className={`toolbarItem ${activeTool == 3 ? "active" : ""}`} onClick={() => handleToolOnClick(3)}> <Link className='tIcon'/> </button> { /* Connect */ }
          <button className={`toolbarItem ${activeTool == 4 ? "active" : ""}`} onClick={() => handleToolOnClick(4)}> <Trash className='tIcon'/> </button> { /* Delete */ }
        </div>

        <section className='canvasArea' ref={canvasRef}>
          <div className='canvasContent' ref={contentRef}>

            <svg className='connectionLayer' ref={connectionLayer}>
              {lineStart && lineEnd && (
                <line
                      x1={lineStart.x} y1={lineStart.y}
                      x2={lineEnd.x}   y2={lineEnd.y}
                />
              )}
            </svg>

          </div>
        </section>

      </section>
    </>
  )
}

export default App
