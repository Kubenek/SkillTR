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

let savedState = JSON.parse(localStorage.getItem('creatorState')) || {}

export const creatorState = { ...defaultState, ...savedState }

export function setCreatorState(updates) {
  Object.assign(creatorState, updates)
  localStorage.setItem('creatorState', JSON.stringify(creatorState))
}
