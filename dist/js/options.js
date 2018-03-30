var arr_el_input_colors = document.querySelectorAll(".color-input");
var arr_el_undo = document.querySelectorAll(".undo");
var arr_el_labels = document.querySelectorAll(".number-label");
var el_digit_wrap = document.getElementById("digits");
var el_range_bg = document.getElementById("bg");
var el_check_usebg = document.getElementById("usebg");
var options = {
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
        "#6b0000",
        "none" // background
    ],
    active: true,
    usebg: false,
    background: 0
};
var cachedColors = options.colors;
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(options, function (storedOptions) {
        options = storedOptions;
        cachedColors = options.colors.slice();
        el_check_usebg.checked = options.usebg;
        el_range_bg.value = '' + (255 - options.background);
        for (var i = 0; i < 10; ++i) {
            arr_el_input_colors[i].value = cachedColors[i];
            arr_el_labels[i].style.color = cachedColors[i];
            arr_el_undo[i].style.background = cachedColors[i];
            arr_el_undo[i].style.color = isDarkColor(cachedColors[i]) ?
                "#fff" : "#000";
        }
        document.body.style.background = cachedColors[10];
    });
});
el_digit_wrap.addEventListener("change", handleColorInput);
el_digit_wrap.addEventListener("click", handleClickUndo);
document.getElementById("bgwrap").addEventListener("change", function (event) {
    options.usebg = el_check_usebg.checked;
    options.background = 255 - parseInt(el_range_bg.value);
    options.colors[10] = options.usebg ? "rgb(" +
        options.background + "," +
        options.background + "," +
        options.background + ")" : "none";
    chrome.storage.sync.set(options);
    document.body.style.background = options.colors[10];
});
/**
 * when undo button is clicked, set color to cached value
 */
function handleClickUndo(event) {
    if (event.target.className == "undo active") {
        var d = event.target.id.substring(1);
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
/**
 * check where a color is generally dark vs light
 * @param hexString 6-char hex color string with leading '#'
 * @returns boolean true if color is dark
 */
function isDarkColor(hexString) {
    var n = parseInt(hexString.substring(1), 16);
    var rgbSum = (n & 255) + ((n >>> 8) & 255) + ((n >>> 16) & 255);
    return rgbSum < 500;
}
