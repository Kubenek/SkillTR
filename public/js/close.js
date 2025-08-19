const elem = document.querySelector(".error-body");

document.addEventListener('mousedown', (e) => {
    if(!elem.contains(e.target)) {
        elem.parentElement.style.display = "none";
    }
})