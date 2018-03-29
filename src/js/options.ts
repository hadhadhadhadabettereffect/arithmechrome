import { options as defaultOptions } from "./defaults";
import "./components/Toggle";

const arr_el_input_colors = document.querySelectorAll(".color-input");
const arr_el_undo = document.querySelectorAll(".undo");
const arr_el_labels = document.querySelectorAll(".number-label");
var el_active_toggle;

// init with default values
var options = defaultOptions;
var cachedColors = options.colors;

customElements.whenDefined("active-toggle").then(() => {
    el_active_toggle = document.createElement("active-toggle");
    document.getElementById("activeToggle").appendChild(el_active_toggle);
    el_active_toggle.addEventListener("toggle", function () {
        options.active = el_active_toggle.checked;
        chrome.storage.sync.set(options);
    });
});
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(defaultOptions, function (storedOptions) {
        options = storedOptions;
        cachedColors = options.colors.slice();
        el_active_toggle.checked = options.active;
        for (let i=0; i<10; ++i) {
            (<HTMLInputElement>arr_el_input_colors[i]).value = cachedColors[i];
            (<HTMLElement>arr_el_labels[i]).style.color = cachedColors[i];
            (<HTMLElement>arr_el_undo[i]).style.color = cachedColors[i];
        }
    });
});
document.getElementById("digits").addEventListener("change", handleColorInput);
document.getElementById("digits").addEventListener("click", handleClickUndo);

/**
 * when undo button is clicked, set color to cached value
 */
function handleClickUndo (event) {
    if ((<HTMLElement>event.target).className == "undo active") {
        let d = event.target.id.substring(1);
        (<HTMLInputElement>arr_el_input_colors[d]).value = cachedColors[d];
        updateColor(d, cachedColors[d]);
    }
}

function handleColorInput (event) {
    updateColor(event.target.id.substring(1), event.target.value);
}

/**
 * save new color value
 * show undo button if different from cached value
 * @param n number whose color is being updated
 * @param color new color value
 */
function updateColor (n, color) {
    options.colors[n] = color;
    chrome.storage.sync.set(options);
    (<HTMLElement>arr_el_labels[n]).style.color = color;
    arr_el_undo[n].className = cachedColors[n] == color ?
        "undo" : "undo active";
}