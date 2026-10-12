export type MutableRef<T> = {
  current: T;
};

export interface CanvasInteraction {
  dragging: MutableRef<boolean>;
  wasDragging: MutableRef<boolean>;
  disableDragging: MutableRef<boolean>;
  mouseDown: MutableRef<boolean>;
  position: MutableRef<{ x: number; y: number }>;
  lastMousePosition: MutableRef<{ x: number; y: number }>;
  draggedNode: MutableRef<HTMLDivElement | null>;
}