import { switchIcon } from "./QoL.js";

const eyeIcon = document.getElementById("eyeIcon")

eyeIcon.addEventListener("click", () => {
    let state = eyeIcon.dataset.icon

    if(state === "0") { switchIcon('eyeIcon', '/../images/icons/bx-eye-closed.png'); state = "1"; }
    else { switchIcon('eyeIcon', '/../images/icons/bx-eye-alt.png'); state = "0" }

    togglePassVisibility(state)

    eyeIcon.dataset.icon = state;
})

function togglePassVisibility(state) {
    const passInput = document.querySelector(".pass-input")
    if(state === "0") passInput.type = "text";
    else passInput.type = "password"
}   