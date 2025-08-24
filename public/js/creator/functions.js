import { creatorState } from './creatorState.js'
import { COLLISION_RADIUS } from '../config.js'
import { removeElementFromList, initializeElement } from '../QoL.js'

// * Overlap Logic
export function nodesOverlap(currentNode) {
  for (const other of creatorState.nodes) {
    if (other === currentNode) continue

    if (circlesOverlap(currentNode.x, currentNode.y, other.x, other.y)) {
      return true
    }
  }
  return false
}

export function circlesOverlap(ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const dist = dx * dx + dy * dy
  return dist < COLLISION_RADIUS * COLLISION_RADIUS
}
// * ===========================

// * Connection lines position logic
export function updateConnectedLines(movedNode) {
  const { connections } = creatorState

  for (const conn of connections) {
    const { fromNode, toNode } = conn
    if (fromNode !== movedNode && toNode !== movedNode) continue

    updateLinePosition(conn.line, fromNode, toNode)
  }
}

export function updateConnectionLinesPositions() {
  for (const conn of creatorState.connections) {
    const nodeA = conn.fromNode
    const nodeB = conn.toNode

    updateLinePosition(conn.line, nodeA, nodeB)
  }
}

export function updateActiveLinePos(mouseX, mouseY) {
  // ? Active Lines
  if (!creatorState.activeLine || !creatorState.selectNodeFirst) return

  const fromNode = creatorState.selectNodeFirst

  updateLinePosition(creatorState.activeLine, fromNode, {
    x: mouseX,
    y: mouseY,
  })
}

function getCenter(obj) {
  if ('offsetLeft' in obj && 'offsetWidth' in obj) {
    return {
      x: obj.offsetLeft + obj.offsetWidth / 2,
      y: obj.offsetTop + obj.offsetHeight / 2,
    }
  } else if ('left' in obj && 'width' in obj) {
    return {
      x: obj.left + obj.width / 2,
      y: obj.top + obj.height / 2,
    }
  } else if ('x' in obj && 'y' in obj) {
    return { x: obj.x, y: obj.y }
  } else {
    throw new Error('Invalid object passed to getCenter')
  }
}

export function updateLinePosition(line, objA, objB) {
  let p1 = getCenter(objA)
  let p2 = getCenter(objB)

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y

  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI

  Object.assign(line.style, {
    width: `${length}px`,
    left: `${p1.x}px`,
    top: `${p1.y}px`,
    transform: `rotate(${angle}deg)`,
  })
}

// * =========================================

// * Misc Functions
export function resetSelectData() {
  ;[creatorState.selectNodeFirst, creatorState.selectNodeSecond].forEach(
    (node) => {
      if (node && node.classList.contains('selected')) {
        node.classList.remove('selected')
      }
    }
  )

  Object.assign(creatorState, {
    selectNodeFirst: null,
    selectNodeSecond: null,
    selectedCount: 0,
    activeLine: null,
  })
}

export function getMousePosRelativeToCanvas(e, canvas) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

export function deleteConnections(deletedNode) {
  creatorState.connections.forEach((conn) => {
    if (conn.fromNode === deletedNode || conn.toNode === deletedNode) {
      conn.line.remove()
    }
  })
  creatorState.connections = creatorState.connections.filter(
    (conn) => conn.fromNode !== deletedNode && conn.toNode !== deletedNode
  )
}

export function getClickPosition(area, event) {
  const { left, top } = area.getBoundingClientRect()
  const { panX, panY, zoom } = creatorState

  const x = (event.clientX - left - panX) / zoom
  const y = (event.clientY - top - panY) / zoom

  return { x, y }
}

export function createDeletePopup(node = null, yHandler = null) {
  creatorState.isPopupActive = true

  var popup = initializeElement('div', 'popupContainer')
  var content = initializeElement('div', 'popupBody')
  var p = initializeElement('p', null, 'Confirm delete?')

  var yBtn = initializeElement('button', 'yBtn', 'Yes')
  var nBtn = initializeElement('button', 'nBtn', 'No')

  if (node !== null) {
    yBtn.onclick = () => handleConfirmDelete(node, popup)
  } else {
    yBtn.onclick = () => yHandler(popup)
  }
  nBtn.onclick = () => handleCancelDelete(popup)

  var popupButtons = initializeElement('div', 'popupBtn')
  popupButtons.append(yBtn, nBtn)

  content.append(p, popupButtons)
  popup.appendChild(content)
  document.body.appendChild(popup)
}

function handleConfirmDelete(node, popup) {
  deleteConnections(node)
  node.remove()
  popup.remove()
  creatorState.isPopupActive = false
  removeElementFromList(creatorState.nodes, node)
}

function handleCancelDelete(popup) {
  popup.remove()
  creatorState.isPopupActive = false
}
