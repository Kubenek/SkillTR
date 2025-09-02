const defaultState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  isDraggingNode: false,
  draggingNodeElem: null,
  lastNodeData: null,
  currentItem: 'Place',
  nodeOriginalX: 0,
  nodeOriginalY: 0,
  sourceConnectNode: null,
  isPopupActive: false,
  selectedCount: 0,
  selectNodeFirst: null,
  selectNodeSecond: null,
  activeLine: null,
  mouseMoveHandler: null,
  emptyConnectHandler: null,
  connections: [],
  disableDrag: false,
  nodes: [],
  selectionBox: null,
  isSelecting: false,
  selectCollidingNodes: [],
  delCounter: null,
  deleteButton: null,
}

let savedState = {}
try {
  savedState = JSON.parse(localStorage.getItem('creatorState')) || {}
} catch (e) {
  console.warn('Failed to parse saved state:', e)
}

export const creatorState = { ...defaultState, ...savedState }

console.log(creatorState)

export function setCreatorState(updates) {
  Object.assign(creatorState, updates)

  const stateToSave = {
    nodes: creatorState.nodes,
    connections: creatorState.connections,
  }

  localStorage.setItem('creatorState', JSON.stringify(stateToSave))
}
