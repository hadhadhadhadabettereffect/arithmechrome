(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.options = {
    colors: [
        "#cecece",
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
    onlybody: false,
    useBackground: false,
    backgroundColor: "#eeeeee"
};

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var defaults_1 = require("./defaults");
var el_checkbox_active = document.getElementById("active");
var el_checkbox_onlybody = document.getElementById("onlybody");
var el_span_status = document.getElementById("status");
var arr_el_input_colors = [
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
var arr_el_div_colorsquares = [
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
// init with default values
var options;
var popupMsg = "";
var changes = 8191 /* all */;
var unsavedChanges = 0;
var busy = false;
// set listeners
document.addEventListener('DOMContentLoaded', initOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById("digits").addEventListener("focusout", onUpdateColor);
/**
 * populate input values with stored values or defaults on load
 */
function initOptions() {
    chrome.storage.sync.get(defaults_1.options, function (storedOptions) {
        options = storedOptions;
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
    options.active = el_checkbox_active.checked;
    options.onlybody = el_checkbox_onlybody.checked;
    chrome.storage.sync.set(options, function () {
        popupMsg = "Options saved.";
        unsavedChanges = 0;
        changes |= 4096 /* message */;
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
    for (var i = 13 /* count */; i >= 0; --i) {
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
    switch (i) {
        case 12 /* _message */:
            // set msg text
            el_span_status.textContent = popupMsg;
            // if popupMsg, set timeout to clear msg after 1200ms
            if (popupMsg.length) {
                popupMsg = "";
                changes |= 4096 /* message */;
                setTimeout(signalUpdate, 1200);
            }
            break;
        case 10 /* _active */:
            el_checkbox_active.checked = options.active;
            break;
        case 11 /* _onlybody */:
            el_checkbox_onlybody.checked = options.onlybody;
            break;
        // colors
        default:
            var hex = options.colors[i];
            // update input with normalized hex string
            arr_el_input_colors[i].value = hex;
            // set preview div color
            arr_el_div_colorsquares[i].style.background = hex;
            break;
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

},{"./defaults":1}]},{},[2,3]);
