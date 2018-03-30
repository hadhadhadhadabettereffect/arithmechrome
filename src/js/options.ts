declare var chrome;

const arr_el_input_colors = document.querySelectorAll(".color-input");
const arr_el_undo = document.querySelectorAll(".undo");
const arr_el_labels = document.querySelectorAll(".number-label");
const el_digit_wrap = document.getElementById("digits");
const el_range_bg:HTMLInputElement = <HTMLInputElement> document.getElementById("bg");
const el_check_usebg:HTMLInputElement = <HTMLInputElement> document.getElementById("usebg");
var options = {
    colors: [
        "#888888", // 0 gray
        "#000000", // 1 black
        "#67a4ff", // 2 light blue
        "#fb1515", // 3 red
        "#0c52ef", // 4 blue
        "#18713c", // 5 green
        "#5a0eaf", // 6 purple
        "#f5970c", // 7 orange
        "#000080", // 8 navy
        "#6b0000", // 9 maroon
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
        el_range_bg.value = ''+ (255 - options.background);
        for (let i=0; i<10; ++i) {
            (<HTMLInputElement>arr_el_input_colors[i]).value = cachedColors[i];
            (<HTMLElement>arr_el_labels[i]).style.color = cachedColors[i];
            (<HTMLElement>arr_el_undo[i]).style.background = cachedColors[i];
            (<HTMLElement>arr_el_undo[i]).style.color = isDarkColor(cachedColors[i]) ?
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

/**
 * check where a color is generally dark vs light
 * @param hexString 6-char hex color string with leading '#'
 * @returns boolean true if color is dark
 */
function isDarkColor(hexString)  {
    let n = parseInt(hexString.substring(1), 16);
    let rgbSum = (n&255) + ((n>>>8)&255) + ((n>>>16)&255);
    return rgbSum < 500;
}