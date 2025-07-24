import { creatorState } from './creatorState.js'
import { updateStyles } from './delete.js';

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
            updateStyles("#4070F4", false)
            creatorState.isSelecting = false;
            if (creatorState.selectionBox) creatorState.selectionBox.remove(); creatorState.selectionBox = null;
        }

    })
})