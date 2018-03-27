import { options as defaultOptions } from "./defaults";


const el_checkbox_active: HTMLInputElement =
    <HTMLInputElement> document.getElementById("active");
const el_checkbox_onlybody: HTMLInputElement =
    <HTMLInputElement> document.getElementById("onlybody");
const el_span_status: HTMLSpanElement =
    <HTMLSpanElement> document.getElementById("status");
const arr_el_input_colors: HTMLInputElement[] = [
    <HTMLInputElement> document.getElementById("n0"),
    <HTMLInputElement> document.getElementById("n1"),
    <HTMLInputElement> document.getElementById("n2"),
    <HTMLInputElement> document.getElementById("n3"),
    <HTMLInputElement> document.getElementById("n4"),
    <HTMLInputElement> document.getElementById("n5"),
    <HTMLInputElement> document.getElementById("n6"),
    <HTMLInputElement> document.getElementById("n7"),
    <HTMLInputElement> document.getElementById("n8"),
    <HTMLInputElement> document.getElementById("n9")
];
const arr_el_div_colorsquares: HTMLInputElement[] = [
    <HTMLInputElement> document.getElementById("p0"),
    <HTMLInputElement> document.getElementById("p1"),
    <HTMLInputElement> document.getElementById("p2"),
    <HTMLInputElement> document.getElementById("p3"),
    <HTMLInputElement> document.getElementById("p4"),
    <HTMLInputElement> document.getElementById("p5"),
    <HTMLInputElement> document.getElementById("p6"),
    <HTMLInputElement> document.getElementById("p7"),
    <HTMLInputElement> document.getElementById("p8"),
    <HTMLInputElement> document.getElementById("p9")
];

// init with default values
var options;
var popupMsg = "";
var changes = OptionEl.all;
var unsavedChanges = 0;
var busy = false;

// set listeners
document.addEventListener('DOMContentLoaded', initOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById("digits").addEventListener("focusout", onUpdateColor);


/**
 * populate input values with stored values or defaults on load
 */
function initOptions () {
    chrome.storage.sync.get(defaultOptions, function (storedOptions) {
        options = storedOptions;
        signalUpdate();
    });
}

/**
 * validate updated input values
 */
function onUpdateColor (event) {
    var val = normalizeHex(event.target.value);
    var d = parseInt(event.target.id.substring(1));
    
    // return if no change was made
    if (val.length && val == options.colors[d]) return;

    // mark value as updated
    changes |= (1 << d);
    unsavedChanges |= (1 << d);

    // 0-length if unable to normalize
    if (val.length === 0) popupMsg = ":?";
    // update color value if valid hex
    else options.colors[d] = val;
    
    // update dom
    signalUpdate();
}
 
/**
 * save changes
 */
function saveOptions () {
    // set bool values from checkboxes
    options.active = el_checkbox_active.checked;
    options.onlybody = el_checkbox_onlybody.checked;    
    chrome.storage.sync.set(options, function() {
        popupMsg = "Options saved.";
        unsavedChanges = 0;
        changes |= OptionEl.message;
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
function signalUpdate () {
    if (!busy) {
        busy = true;
        setTimeout(applyDomUpdates, 16);
    }
}

/**
 * apply changes to options panel
 */
function applyDomUpdates () {
    // check for changes and apply updates
    for (let i = OptionEl.count; i >= 0; --i) {
        if (changes & (1<<i)) {
            changes ^= (1<<i);
            updateDomNode(i);
            if (changes === 0) break;
        }
    }

    // set busy to false after updates finished
    busy = false;
}

/**
 * update individual dom node. called from applyDomUpdates
 * @param {number} i OptionEl index of el to update
 */
function updateDomNode (i: number) {
    switch (i) {
        case OptionEl._message:
            // set msg text
            el_span_status.textContent = popupMsg;

            // if popupMsg, set timeout to clear msg after 1200ms
            if (popupMsg.length) {
                popupMsg = "";
                changes |= OptionEl.message;
                setTimeout(signalUpdate, 1200);
            }
            break;
        
        case OptionEl._active:
            el_checkbox_active.checked = options.active;
            break;
            
        case OptionEl._onlybody:
            el_checkbox_onlybody.checked = options.onlybody;
            break;

        // colors
        default:
            let hex = options.colors[i];
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
function normalizeHex (hex: string) : string {
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
    if (hex.length !== 6) return '';
    // add leading # back in
    return '#' + hex;
 }

