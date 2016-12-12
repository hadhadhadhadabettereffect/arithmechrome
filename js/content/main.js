var currentNode, iterator;
var items = [];
var revertIndex = 0;
var sendIndex = 0;
var splitIndex = 0;
var count = 0;

/**
 * send values to background.js to translate into colors
 */
function sendValues () {
    if (sendIndex >= count) return;
    chrome.runtime.sendMessage({
        index: sendIndex,
        values: items[sendIndex++].getNumbers()
    });
    setTimeout(sendValues, 0);
}

/**
 * split text nodes to isolate numbers
 */
function doTheSplits (start) {
    var end;
    do {
        if ((!items[splitIndex].split()) && (++splitIndex >= count)) {
            splitIndex = 0;
            sendIndex = 0;
            setTimeout(sendValues, 0);
            return;
        }
        end = performance.now();
    } while (end - start < 3);
    requestAnimationFrame(doTheSplits);
}

/**
 * remove added spans, revert split nodes to single strings
 */
function removeSpans (start) {
    do {
        items[revertIndex].revert();
        end = performance.now();
    } while (++revertIndex < count && end - start < 3);
    if (revertIndex < count) requestAnimationFrame(removeSpans);
}

/**
 * create a SplitText object for each node iterator match
 * start splitting text when done
 */
function iterate () {
    if (currentNode = iterator.nextNode()) {
        items[count] = new SplitText(currentNode);
        ++count;
        setTimeout(iterate, 0);
    } else {
        currentNode = iterator = null;
        splitIndex = 0;
        requestAnimationFrame(doTheSplits);
    }
}

/**
 * create node iterator, start loop
 */
function initIterator () {
    iterator = document.createNodeIterator(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        function (node) {
            return (
                    // first child is a text node
                    node.firstChild &&
                    node.firstChild.nodeType === 3 /* Node.TEXT_NODE */ &&

                    // is not a script tag
                    node.nodeName != "SCRIPT" &&

                    // text contains a digit
                    /\d/.test(node.firstChild.textContent)) ?
                        1 /* NodeFilter.FILTER_ACCEPT */ :
                        2 /* NodeFilter.FILTER_REJECT */;
        }
    );
    setTimeout(iterate, 0);
}

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        switch (msg.msgType) {
            case "colors":
                items[msg.index].wrapNumbers(msg.colors);
                break;

            case "parse":
                if (count) {
                    sendIndex = 0;
                    sendValues();
                } else {
                    initIterator();
                }
                break;

            case "hide":
                if (count) {
                    revertIndex = 0;
                    requestAnimationFrame(removeSpans);
                }
                break;
        }
    }
);