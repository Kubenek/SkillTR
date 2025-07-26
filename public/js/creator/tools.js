import { creatorState } from './creatorState.js'

const linkItems = document.querySelectorAll(".link-item");
linkItems.forEach((linkItem, index) => {
    linkItem.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        linkItem.classList.add("active");
        const indicator = document.querySelector(".indicator");
        indicator.style.left = `${index * 95 + 48}px`;

        const name = linkItem.querySelector(".link-text").textContent
        creatorState.currentItem = name

        if(creatorState.isSelecting) {
            const linkItem = document.querySelectorAll(".link-item")[2]
            if(linkItem.classList.contains("active")) linkItem.classList.remove("active")
            else { linkItem.classList.remove("del-active"); indicator.classList.remove("del-active") }
        
            creatorState.isSelecting = false;
            if (creatorState.selectionBox) creatorState.selectionBox.remove(); creatorState.selectionBox = null;
        }

    })
})