var iterator;

function wrapNumbers () {
    var end, start = performance.now();
    let currentNode = iterator.nextNode();
    do {
        if (currentNode && /\d/.test(currentNode.textContent)) {
            let text = currentNode.textContent;
            text.replace(/\d/g, "<span class='digit--$&'>$&</span>");
            currentNode.innerHTML = text;
        }
        if (!(currentNode = iterator.nextNode())) break;
        end = performance.now();
    } while (end - start < 3);
    if (currentNode) requestAnimationFrame(wrapNumbers);
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

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        switch (msg.msgType) {
            case MsgType.parse:
                startIterator();
                break;
        }
    }
);