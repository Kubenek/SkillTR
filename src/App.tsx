import './App.css'
import { useEffect, useRef, useState } from 'react'

function App() {

  const [dragging, setDragging] = useState(false);
  
  const position = useRef({x: 0, y: 0})
  const lastMousePosition = useRef({x: 0, y:0})
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {
      if(!dragging) return;

      const dx = e.clientX - lastMousePosition.current.x;
      const dy = e.clientY - lastMousePosition.current.y;

      position.current!.x += dx;
      position.current!.y += dy;

      canvasRef.current!.style.backgroundPosition = `${position.current!.x}px ${position.current!.y}px`

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;
    }

    const handleMouseDown = (e: MouseEvent) => {
      setDragging(true);

      lastMousePosition.current.x = e.clientX;
      lastMousePosition.current.y = e.clientY;
    }

    const handleMouseUp = () => {
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

  }, [dragging])

  return (
    <>
      <section className='siteContainer'>
        <section className='canvasArea' ref={canvasRef}>
          
        </section>
      </section>
    </>
  )
}

export default App
