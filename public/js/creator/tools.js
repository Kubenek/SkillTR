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

        const Nodes = document.querySelectorAll(".node")
        
        if(name === "Connect") {
            Nodes.forEach(node => node.classList.add("yl"))
        } else {
            Nodes.forEach(node => node.classList.remove("yl"))
        }

    })
})