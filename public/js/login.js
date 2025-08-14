import { switchIcon } from "./QoL.js";

const fields = document.querySelectorAll(".password")

fields.forEach(field => {
    let eyeIcon = field.querySelector(".eyeIcon")
    let passField = field.querySelector(".pass-input")

    eyeIcon.addEventListener("click", () => {
        let state = eyeIcon.dataset.icon

        if(state === "0") { switchIcon(eyeIcon, '/../images/icons/bx-eye-closed.png'); state = "1"; }
        else { switchIcon(eyeIcon, '/../images/icons/bx-eye-alt.png'); state = "0" }

        togglePassVisibility(state, passField)

        eyeIcon.dataset.icon = state;
    })
})

function togglePassVisibility(state, elem) {
    if(state === "0") elem.type = "text";
    else elem.type = "password"
}   

