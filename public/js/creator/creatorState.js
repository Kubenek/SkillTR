import { updateLinePosition } from './functions.js'

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

renderNodes(creatorState.nodes)
renderConnections(creatorState.connections)

export function setCreatorState(updates) {
  Object.assign(creatorState, updates)

  const stateToSave = {
    nodes: creatorState.nodes,
    connections: creatorState.connections,
  }

  localStorage.setItem('creatorState', JSON.stringify(stateToSave))
}

function renderNodes(nodes) {
  const canvas = document.querySelector('.canvas-content')
  const newNodes = []

  nodes.forEach((data) => {
    const x = data.x
    const y = data.y
    const size = 15

    const node = document.createElement('div')
    node.classList.add('node')

    Object.assign(node.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
    })

    const nodeData = { elem: node, x, y }
    newNodes.push(nodeData)

    canvas.appendChild(node)
  })

  creatorState.nodes = newNodes
}

function renderConnections(connections) {
  const canvas = document.querySelector('.canvas-content')
  const newConns = []

  connections.forEach((item) => {
    const line = document.createElement('div')
    line.classList.add('permanent-line')

    const nodeA = item.fromNode
    const nodeB = item.toNode
    console.log(item)

    newConns.push({
      fromNode: nodeA,
      toNode: nodeB,
      line: line,
    })

    canvas.appendChild(line)
  })
}
