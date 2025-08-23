import { creatorState } from './creatorState.js'
import { initializeElement } from '../QoL.js'

let startX, startY
let hasMoved = false
let isDraggingBox = false
let offsetX, offsetY

document.addEventListener('keydown', (e) => {
  //* Toggle Alt Delete

  if (e.shiftKey && creatorState.currentItem === 'Delete') {
    if (creatorState.isSelecting) {
      updateStyles(false)
      creatorState.isSelecting = false
      if (creatorState.selectionBox) creatorState.selectionBox.remove()
      creatorState.selectionBox = null
      const selectedNodes = document.querySelectorAll('.select-del')
      selectedNodes.forEach((node) => {
        node.classList.remove('select-del')
      })
      removeCounter()
    } else {
      updateStyles(true)
      creatorState.isSelecting = true
      const colAmount = creatorState.selectCollidingNodes.length
      addCounter(colAmount)
    }
  }
})

document.addEventListener('mousedown', (e) => {
  if (creatorState.isSelecting) {
    if (e.target.closest('.nav')) return
    if (creatorState.selectionBox && !isDraggingBox)
      creatorState.selectionBox.remove()
    creatorState.selectionBox = null

    const selectedNodes = document.querySelectorAll('.select-del')
    selectedNodes.forEach((node) => node.classList.remove('select-del'))

    startX = e.clientX
    startY = e.clientY
    hasMoved = false

    creatorState.selectionBox = document.createElement('div')

    Object.assign(creatorState.selectionBox.style, {
      left: `${startX}px`,
      top: `${startY}px`,
    })

    creatorState.selectionBox.classList.add('selectBox')
    enableDragging(creatorState.selectionBox)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    document.body.appendChild(creatorState.selectionBox)
  }
})

function checkCollisions(selectBox) {
  const rect = selectBox.getBoundingClientRect()
  const allElem = document.querySelectorAll('*')
  const collidingNodes = []

  allElem.forEach((el) => {
    const eRect = el.getBoundingClientRect()
    const isOverlap =
      rect.left < eRect.right &&
      rect.right > eRect.left &&
      rect.top < eRect.bottom &&
      rect.bottom > eRect.top
    if (isOverlap && el.classList.contains('node')) collidingNodes.push(el)
  })

  return collidingNodes
}

function onMouseMove(e) {
  if (!creatorState.isSelecting) return

  if (isDraggingBox) {
    //* drag functionality
    const { clientX, clientY } = e
    Object.assign(creatorState.selectionBox.style, {
      left: `${clientX - offsetX}px`,
      top: `${clientY - offsetY}px`,
    })

    const newSet = new Set(checkCollisions(creatorState.selectionBox))
    const prevSet = creatorState.selectCollidingNodes

    for (const node of prevSet)
      if (!newSet.has(node)) node.classList.remove('select-del')
    for (const node of newSet)
      if (!node.classList.contains('select-del'))
        node.classList.add('select-del')

    creatorState.selectCollidingNodes = newSet
    return
  }

  const { clientX: x, clientY: y } = e
  const dx = Math.abs(x - startX)
  const dy = Math.abs(y - startY)

  if (!hasMoved && (dx > 1 || dy > 1)) hasMoved = true

  const left = Math.min(x, startX)
  const top = Math.min(y, startY)
  const width = Math.abs(x - startX)
  const height = Math.abs(y - startY)

  Object.assign(creatorState.selectionBox.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  })

  const colliding = checkCollisions(creatorState.selectionBox)

  const remaining = creatorState.selectCollidingNodes.filter(
    (item) => !colliding.includes(item)
  )

  remaining.forEach((node) => {
    node.classList.remove('select-del')
  })

  if (creatorState.selectCollidingNodes.length < 50) {
    colliding.forEach((node) => node.classList.add('select-del'))

    const selectionChanged =
      creatorState.selectCollidingNodes.length !== colliding.length
    if (selectionChanged) {
      changeCount(creatorState.delCounter, colliding.length)

      const counter = creatorState.delCounter
      counter.classList.contains('pop')
        ? triggerAnimation(counter, 'pop')
        : counter.classList.add('pop')
    }

    creatorState.selectCollidingNodes = colliding
  }
}

function addCounter(amount) {
  const counter = document.createElement('p')
  const site = document.querySelector('.site-container')
  counter.innerText = `${amount}/50`
  counter.classList.add('delCounter', 'show')
  creatorState.delCounter = counter
  site.append(counter)
}

function removeCounter() {
  const counter = document.querySelector('.delCounter')
  counter.remove()
}

function onMouseUp(e) {
  if (creatorState.isSelecting) {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    isDraggingBox = false
  }
}

function updateStyles(status) {
  const indicator = document.querySelector('.indicator')
  const linkItem = document.querySelectorAll('.link-item')[2]

  if (status) {
    linkItem.classList.add('del-active')
    indicator.classList.add('del-active')
  } else {
    linkItem.classList.remove('del-active')
    indicator.classList.remove('del-active')
  }
}

function addButtons() {
  var delBtn = initializeElement('button', 'delAll', 'Delete')
  document.body.appendChild(delBtn)
}

function enableDragging(box) {
  box.addEventListener('mousedown', (e) => {
    const rect = box.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top
    isDraggingBox = true
    e.stopPropagation()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
}

function changeCount(counter, count) {
  counter.innerText = `${count}/50`
}

function triggerAnimation(element, animName) {
  element.classList.remove(animName)
  void element.offsetWidth
  element.classList.add(animName)
}
