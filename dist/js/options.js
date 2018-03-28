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
const el_span_status = document.getElementById("status");
const arr_el_input_colors = [
    document.getElementById("n0"),
    document.getElementById("n1"),
    document.getElementById("n2"),
    document.getElementById("n3"),
    document.getElementById("n4"),
    document.getElementById("n5"),
    document.getElementById("n6"),
    document.getElementById("n7"),
    document.getElementById("n8"),
    document.getElementById("n9")
];
const arr_el_div_colorsquares = [
    document.getElementById("p0"),
    document.getElementById("p1"),
    document.getElementById("p2"),
    document.getElementById("p3"),
    document.getElementById("p4"),
    document.getElementById("p5"),
    document.getElementById("p6"),
    document.getElementById("p7"),
    document.getElementById("p8"),
    document.getElementById("p9")
];
var el_active_toggle;
// init with default values
var options = defaults_1.options;
var popupMsg = "";
var changes = 4095 /* all */;
var unsavedChanges = 0;
var busy = false;
// set listeners
document.addEventListener('DOMContentLoaded', initOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById("digits").addEventListener("focusout", onUpdateColor);
customElements.whenDefined("active-toggle").then(() => {
    el_active_toggle = document.createElement("active-toggle");
    document.getElementById("activeToggle").appendChild(el_active_toggle);
    el_active_toggle.addEventListener("toggle", onActiveToggle);
});
function onActiveToggle() {
    options.active = el_active_toggle.checked;
    chrome.storage.sync.set(options);
}
/**
 * populate input values with stored values or defaults on load
 */
function initOptions() {
    chrome.storage.sync.get(defaults_1.options, function (storedOptions) {
        options = storedOptions;
        el_active_toggle.checked = options.active;
        signalUpdate();
    });
}
/**
 * validate updated input values
 */
function onUpdateColor(event) {
    var val = normalizeHex(event.target.value);
    var d = parseInt(event.target.id.substring(1));
    // return if no change was made
    if (val.length && val == options.colors[d])
        return;
    // mark value as updated
    changes |= (1 << d);
    unsavedChanges |= (1 << d);
    // 0-length if unable to normalize
    if (val.length === 0)
        popupMsg = ":?";
    else
        options.colors[d] = val;
    // update dom
    signalUpdate();
}
/**
 * save changes
 */
function saveOptions() {
    // set bool values from checkboxes
    options.active = el_active_toggle.checked;
    chrome.storage.sync.set(options, function () {
        popupMsg = "Options saved.";
        unsavedChanges = 0;
        changes |= 2048 /* message */;
        signalUpdate();
    });
}
/*********************************
 * dom update
 */
/**
 * called when an option gets updated.
 * sets timeout for dom update fn if not already set
 */
function signalUpdate() {
    if (!busy) {
        busy = true;
        setTimeout(applyDomUpdates, 16);
    }
}
/**
 * apply changes to options panel
 */
function applyDomUpdates() {
    // check for changes and apply updates
    for (let i = 12 /* count */; i >= 0; --i) {
        if (changes & (1 << i)) {
            changes ^= (1 << i);
            updateDomNode(i);
            if (changes === 0)
                break;
        }
    }
    // set busy to false after updates finished
    busy = false;
}
/**
 * update individual dom node. called from applyDomUpdates
 * @param {number} i OptionEl index of el to update
 */
function updateDomNode(i) {
    if (i === 11 /* _message */) {
        el_span_status.textContent = popupMsg;
        // if popupMsg, set timeout to clear msg after 1200ms
        if (popupMsg.length) {
            popupMsg = "";
            changes |= 2048 /* message */;
            setTimeout(signalUpdate, 1200);
        }
    }
    else if (i < 10) {
        let hex = options.colors[i];
        // update input with normalized hex string
        arr_el_input_colors[i].value = hex;
        // set preview div color
        arr_el_div_colorsquares[i].style.background = hex;
    }
}
/*********************************
 * util
 */
/**
 * normalizes hex color strings
 * @param  {string} hex hex string to normalize
 * @return {string}     '#' + 6-digit hex or empty string
 */
function normalizeHex(hex) {
    // remove non-hex characters including #
    hex = hex.replace(/[^a-f\d]/gi, '');
    // expand 3 digit hex colors
    // e.g. #a7c => #aa77cc
    if (hex.length === 3) {
        hex = hex[0] + hex[0] +
            hex[1] + hex[1] +
            hex[2] + hex[2];
    }
    // return empty string if not valid hex color
    if (hex.length !== 6)
        return '';
    // add leading # back in
    return '#' + hex;
}

},{"./components/Toggle":1,"./defaults":2}]},{},[3,4]);
