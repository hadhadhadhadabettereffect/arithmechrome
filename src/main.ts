var iterator, styleNode;
var colors, nodes = [];

chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        colors = msg;
        requestAnimationFrame(writeCSS);
        if (!iterator) startIterator();
    }
);

/**
 * traverse dom via node iterator, wrap digits with styled spans
 */
function wrapNumbers () {
    var end, start = performance.now();
    let currentNode = iterator.nextNode();
    do {
        // if text node contains any number chars
        if (currentNode && /\d/.test(currentNode.textContent)) {
            // storing a ref to the node in an array to avoid changing the dom
            // while the iterator is still going over the original dom
            nodes.push(currentNode);
        }
        if (!(currentNode = iterator.nextNode())) break;
        end = performance.now();
    } while (end - start < 3);
    if (currentNode) requestAnimationFrame(wrapNumbers)
    else {
        // reversing order so calling nodes.pop() updates from top to bottom
        nodes = nodes.reverse();
        requestAnimationFrame(swapHTML);
    }
}

/**
 * for each node in the nodes array, wrap digit chars with spans
 * and assign css class names based on the wrapped digits
 */
function swapHTML () {
    var end, start = performance.now();
    var el;
    do {
        if (!nodes.length) break;
        el = nodes.pop();
        el.innerHTML = el.textContent.replace(/\d/g,
            "<span class='digit--$&'>$&</span>");
    } while (end - start < 3);
    if (nodes.length) requestAnimationFrame(swapHTML);
}

/**
 * create node iterator, start loop
 */
function startIterator () {
    iterator = document.createNodeIterator(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        <any>function (node) {
            return (
                node.firstChild &&
                // first child is a text node
                node.firstChild.nodeType === 3 /* Node.TEXT_NODE */ &&
                // is not a script tag
                node.nodeName != "SCRIPT" &&
                // text contains a digit
                /\d/.test(node.firstChild.textContent)) ?
                    1 /* NodeFilter.FILTER_ACCEPT */ :
                    2 /* NodeFilter.FILTER_REJECT */;
        }
    );
    requestAnimationFrame(wrapNumbers);
}

/**
 * add style tag to head with color options
 */
function writeCSS () {
    if (!styleNode) {
        styleNode = document.createElement("style");
        document.head.appendChild(styleNode);
    }
    var styleText = "";
    for (let i=0; i<10; ++i) {
        styleText += ".digit--" + i + "{color:" + colors[i] + ";}";
    }
    styleNode.innerHTML = styleText;
}