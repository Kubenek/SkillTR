
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