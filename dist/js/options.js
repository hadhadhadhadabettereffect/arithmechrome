(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
let tmpl = document.createElement("template");
tmpl.innerHTML = `
    <style scope="active-toggle">
        #wrap {
            position: relative;
            width: 28px;
            height: 16px;
            z-index: 0;
        }
        #bar {
            background-color: gray;
            border-radius: 8px;
            height: 12px;
            left: 3px;
            opacity: 0.4;
            position: absolute;
            top: 2px;
            transition: background-color linear 80ms;
            width: 24px;
            z-index: 0;
        }
        #button {
            background-color: #ccc;
            border-radius: 50%;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
            height: 16px;
            position: relative;
            transition: transform linear 80ms, background-color linear 80ms;
            width: 16px;
            z-index: 1;
        }
        :host([checked]) #bar {
            background-color: #319cb3;
        }
        :host([checked]) #button {
            background-color: #319cb3;
            transform: translate3d(14px, 0, 0);
        }
    </style>
    <div id="wrap">
        <div id="bar"></div>
        <div id="button"></div>
    </div>
`;
class Toggle extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.addEventListener("click", e => {
            this.toggle();
        });
    }
    static get observedAttributes() {
        return ['checked'];
    }
    get checked() {
        return this.hasAttribute("checked");
    }
    set checked(val) {
        if (val) {
            this.setAttribute("checked", "");
        }
        else {
            this.removeAttribute("checked");
        }
    }
    toggle() {
        this.checked = !this.checked;
        this.dispatchEvent(new Event("toggle"));
    }
}
window.customElements.define("active-toggle", Toggle);

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = {
    colors: [
        "#888888",
        "#000000",
        "#67a4ff",
        "#fb1515",
        "#0c52ef",
        "#18713c",
        "#5a0eaf",
        "#f5970c",
        "#000080",
        "#6b0000" // maroon
    ],
    active: true,
    useBackground: false,
    backgroundColor: "#eeeeee"
};

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("./defaults");
require("./components/Toggle");
const arr_el_input_colors = document.querySelectorAll(".color-input");
const arr_el_undo = document.querySelectorAll(".undo");
const arr_el_labels = document.querySelectorAll(".number-label");
var el_active_toggle;
// init with default values
var options = defaults_1.options;
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
    chrome.storage.sync.get(defaults_1.options, function (storedOptions) {
        options = storedOptions;
        cachedColors = options.colors.slice();
        el_active_toggle.checked = options.active;
        for (let i = 0; i < 10; ++i) {
            arr_el_input_colors[i].value = cachedColors[i];
            arr_el_labels[i].style.color = cachedColors[i];
            arr_el_undo[i].style.color = cachedColors[i];
        }
    });
});
document.getElementById("digits").addEventListener("change", handleColorInput);
document.getElementById("digits").addEventListener("click", handleClickUndo);
/**
 * when undo button is clicked, set color to cached value
 */
function handleClickUndo(event) {
    if (event.target.className == "undo active") {
        let d = event.target.id.substring(1);
        arr_el_input_colors[d].value = cachedColors[d];
        updateColor(d, cachedColors[d]);
    }
}
function handleColorInput(event) {
    updateColor(event.target.id.substring(1), event.target.value);
}
/**
 * save new color value
 * show undo button if different from cached value
 * @param n number whose color is being updated
 * @param color new color value
 */
function updateColor(n, color) {
    options.colors[n] = color;
    chrome.storage.sync.set(options);
    arr_el_labels[n].style.color = color;
    arr_el_undo[n].className = cachedColors[n] == color ?
        "undo" : "undo active";
}

},{"./components/Toggle":1,"./defaults":2}]},{},[3,4]);
