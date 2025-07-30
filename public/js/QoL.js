
export function removeElementFromList(list, element) {
    const index = list.findIndex(n => n.elem === element) 
    if(index !== -1) {
        var lastIndex = list.length - 1
        if(lastIndex !== index) {
            list[index] = list[lastIndex]
        }
       list.pop()
    }
}

export function initializeElement(type, className, text) {
    const elem = document.createElement(type)
    if (className) elem.classList.add(className)
    if (text) elem.innerText = text
    return elem;
}

export function switchIcon(elemID, path) {
    const elem = document.getElementById(elemID);
    if (elem) elem.src = path;
}