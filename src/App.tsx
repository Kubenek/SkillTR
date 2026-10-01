import './App.css'
import { CursorPointer, Plus, Move, Link, Trash } from '@boxicons/react';
import { useEffect, useRef, useState } from 'react'

function App() {

  const [dragging, setDragging] = useState(false);
  const mouseDown = useRef(false);
  const wasDragging = useRef(false);
  
  const position = useRef({x: 0, y: 0})
  const lastMousePosition = useRef({x: 0, y:0})

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeTool, setActiveTool] = useState<number | null>(0);
  const [disableTools, setDisableTools] = useState<boolean>(false);
  const [disableDragging, setDisableDragging] = useState<boolean>(false);

  const NODE_HEIGHT = 50;
  const NODE_WIDTH = 50;

  const handleToolOnClick = (id: number) => {
    setActiveTool(id);
  }

  // node adding functionality
  useEffect(() => {

    const handleMouseUp = (e: MouseEvent) => {
      if(activeTool !== 1) return;
      if(disableTools) return;
      if(wasDragging.current) return;

      const node = document.createElement("div")
      node.classList.add("node")

      node.style.left = `${e.clientX - (NODE_WIDTH / 2) - (position.current.x) }px`
      node.style.top = `${e.clientY - (NODE_HEIGHT / 2) - (position.current.y) }px`

      contentRef.current?.appendChild(node)
    }

    window.addEventListener("mouseup", handleMouseUp);

    return() => {
      window.removeEventListener("mouseup", handleMouseUp);
    };

  }, [activeTool, disableTools])


  // dragging functionality
  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {
      if(!mouseDown.current) return;
      if(disableDragging) return;

      const dx = e.clientX - lastMousePosition.current.x;
      const dy = e.clientY - lastMousePosition.current.y;

      const distance = Math.hypot(dx, dy);
      if (distance < 3) return;

      setDragging(true);
      wasDragging.current = true;

      position.current!.x += dx;
      position.current!.y += dy;

      canvasRef.current!.style.backgroundPosition = `${position.current!.x}px ${position.current!.y}px`
      contentRef.current!.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;
    }

    const handleMouseDown = (e: MouseEvent) => {
      mouseDown.current = true;
      wasDragging.current = false;

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;
    }

    const handleMouseUp = () => {
      mouseDown.current = false;
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);

    return() => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };

  }, [dragging, disableDragging])

  return (
    <>
      <section className='siteContainer'>

        <div className='editorToolbar' 
          onMouseEnter={() => {setDisableTools(true); setDisableDragging(true)}}
          onMouseLeave={() => {setDisableTools(false); setDisableDragging(false)}}
        >
          <button className={`toolbarItem ${activeTool == 0 ? "active" : ""}`} onClick={() => handleToolOnClick(0)}> <CursorPointer className='tIcon'/> </button> { /* View */ } 
          <button className={`toolbarItem ${activeTool == 1 ? "active" : ""}`} onClick={() => handleToolOnClick(1)}> <Plus className='tIcon'/> </button> { /* Add */ } 
          <button className={`toolbarItem ${activeTool == 2 ? "active" : ""}`} onClick={() => handleToolOnClick(2)}> <Move className='tIcon'/> </button> { /* Move */ }
          <button className={`toolbarItem ${activeTool == 3 ? "active" : ""}`} onClick={() => handleToolOnClick(3)}> <Link className='tIcon'/> </button> { /* Connect */ }
          <button className={`toolbarItem ${activeTool == 4 ? "active" : ""}`} onClick={() => handleToolOnClick(4)}> <Trash className='tIcon'/> </button> { /* Delete */ }
        </div>

        <section className='canvasArea' ref={canvasRef}>
          <div className='canvasContent' ref={contentRef}>
          </div>
        </section>

      </section>
    </>
  )
}

export default App
