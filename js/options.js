var reg_hex = /^#[a-f\d]{6}$/;

// init with default values
var values = [
  [0,0,0], // 0: black
  [0xc7, 0xc7, 0xc7], // 1: gray
  [0x00, 0x67, 0xcf], // 2: blue
  [0xd5, 0x03, 0x00], // 3: red
  [0x17, 0x2e, 0x9c], // 4: blue-2
  [0x00, 0x80, 0x34], // 5: green
  [0x63, 0x08, 0x87], // 6: purple
  [0xfa, 0xe2, 0x61], // 7: yellow
  [0x00, 0x50, 0x90], // 8: blue-3
  [0x79, 0x02, 0x02], // 9: red-2
  [0x0d, 0x8d, 0x87], // 10: blue/green
  [0xf6, 0xa8, 0x58], // 11: orange
  [0x31, 0x2b, 0x8d], // 12: blue-2/red
  [0xe6, 0x9f, 0xe0]  // 13: pink
];

/**
 * normalizes hex color strings
 * @param  {string} hex hex string to normalize
 * @return {string}     '#' + 6-digit hex or empty string
 */
function normalizeHex(hex) {
    // remove spaces
    hex.replace(/\s/g, '');
    // add leading # if absent
    if (hex[0] != '#') hex = '#' + hex;
    // expand 3 digit hex colors
    // e.g. #a7c => #aa77cc
    if (hex.length === 4) {
        hex = '#' + hex[1] + hex[1] +
                    hex[2] + hex[2] +
                    hex[3] + hex[3];
    }
    // return hex if valid, else return an empty string
    if (reg_hex.test(hex)) return hex;
    return '';
}

/**
 * converts hex string to rgb int array
 * @param  {string} hex normalized hex color string
 * @return {number[3]}   array of rgb int values
 */
function hexToRgb(hex) {
    return [parseInt(hex.substring(1,3), 16),
            parseInt(hex.substring(3,5), 16),
            parseInt(hex.substring(5,7), 16)];
}

/**
 * converts rgb int array into hex color string
 * @param  {number[3]} rgb array of rgb int values
 * @return {string}    '#' + 6-digit hex string
 */
function rgbToHex(rgb) {
    return '#' + (rgb[0] < 16 ? '0' + rgb[0].toString(16) : rgb[0].toString(16)) +
                 (rgb[1] < 16 ? '0' + rgb[1].toString(16) : rgb[1].toString(16)) +
                 (rgb[2] < 16 ? '0' + rgb[2].toString(16) : rgb[2].toString(16));
}

/**
 * set input string value with cached value
 * @param  {number} d digit to revert
 */
function revert_value(d) {
    var hex = rgbToHex(values[d]);
    document.getElementById('n' + d).value = hex;
    document.getElementById('p' + d).style.backgroundColor = hex;
}

function showMessage(txt) {
    var status = document.getElementById('status');
    status.textContent = txt;

    setTimeout(function() {
        status.textContent = '';
    }, 750);
}

/**
 * save changes
 */
function save_options() {
    chrome.storage.sync.set({
        values: values,
        individual: document.getElementById("individual").checked,
        active: document.getElementById("active").checked
    }, function() {
        // Update status to let user know options were saved.
        showMessage("Options saved.");
    });
}

/**
 * populate input values with stored values or defaults on load
 */
function restore_options() {
    chrome.storage.sync.get({
        individual: false,
        active: true,
        values: values
    }, function(items) {
        values = items.values;
        // set hex colors from stored values
        for (var i = 0; i < 10; revert_value(i++));
        // set checkbox bools
        document.getElementById("individual").checked = items.individual;
        document.getElementById("active").checked = items.active;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

/**
 * validate changed input values on blur
 */
document.getElementById("digits").addEventListener("focusout", function(event) {
    var val = normalizeHex(event.target.value);
    var d = parseInt(event.target.id.substring(1));
    // revert value if unable to normalize
    if (val.length === 0) {
        showMessage(":?");
        return revert_value(d);
    }
    // set input text to normalized version
    if (val != event.target.value) {
        event.target.value = val;
    }
    // cache new val
    values[d] = hexToRgb(val);
    // set preview color
    document.getElementById('p' + d).style.backgroundColor = val;
});