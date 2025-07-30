import { switchIcon } from "./QoL.js";

const eyeIcon = document.getElementById("eyeIcon")
eyeIcon.addEventListener("click", () => {
    switchIcon('eyeIcon', '/../images/icons/bx-eye-closed.png');
})