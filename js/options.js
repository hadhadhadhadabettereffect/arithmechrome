const defaultOptions = {
    colors: [
        "#cecece", // gray
        "#000000", // black
        "#67a4ff", // light blue
        "#fb1515", // red
        "#0c52ef", // blue
        "#18713c", // green
        "#5a0eaf", // purple
        "#f5970c", // orange
        "#000080", // navy
        "#6b0000" // maroon
    ],
    active: true,
    useBackground: false,
    backgroundColor: "#eeeeee"
};

// init with default values
var options;
var popupMsg = "";
var changes = -1;
var timeoutFn;

document.addEventListener('DOMContentLoaded', init_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById("digits").addEventListener("focusout", update_input);

/**
 * apply changes to options panel
 */
function update_options_dom () {
    var hex;
    document.getElementById("active").checked = options.active;
    document.getElementById('status').textContent = popupMsg;
    
    // set hex colors from stored values
    for (var i = 0; i < 10; i++) {
        if (changes & (1 << i)) {
            hex = options.colors[i];
            document.getElementById('n' + i).value = hex;
            document.getElementById('p' + i).style.backgroundColor = hex;
        }
    }
    changes = 0;

    // if popupMsg, set timeout to clear msg after 1200ms
    if (popupMsg.length) {
        popupMsg = "";
        clearTimeout(timeoutFn);
        timeoutFn = setTimeout(update_options_dom, 1200);       
    }
}

/**
 * normalizes hex color strings
 * @param  {string} hex hex string to normalize
 * @return {string}     '#' + 6-digit hex or empty string
 */
function normalize_hex (hex) {
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

/**
 * populate input values with stored values or defaults on load
 */
function init_options () {
    chrome.storage.sync.get(defaultOptions, function (storedOptions) {
        options = storedOptions;
        timeoutFn = setTimeout(update_options_dom, 16);
    });
}

/**
 * validate updated input values
 */
function update_input (event) {
    var val = normalize_hex(event.target.value);
    var d = parseInt(event.target.id.substring(1));
    
    // mark value as updated
    changes |= (1 << d);

    // 0-length if unable to normalize
    if (val.length === 0) popupMsg = ":?";
    // update color value if valid hex
    else options.colors[d] = val;
    
    // update dom
    clearTimeout(timeoutFn);
    timeoutFn = setTimeout(update_options_dom, 16);
}
 
/**
 * save changes
 */
function save_options () {
    // set bool values from checkboxes
    options.active = document.getElementById("active").checked;
    
    chrome.storage.sync.set(options, function() {
        popupMsg = "Options saved.";
        clearTimeout(timeoutFn);
        timeoutFn = setTimeout(update_options_dom, 16);
    });
}