var currentNode, iterator;
var items = [];
var currentItem = 0;
var count = 0;

/**
 * send values to background.js to translate into colors
 */
function sendValues () {
    if (currentItem >= count) return;
    chrome.runtime.sendMessage({
        index: currentItem,
        values: items[currentItem++].getNumbers()
    });
    setTimeout(sendValues, 0);
}

/**
 * split text nodes to isolate numbers
 */
function doTheSplits (start) {
    var end;
    do {
        if ((!items[currentItem].split()) && (++currentItem >= count)) {
            currentItem = 0;
            setTimeout(sendValues, 0);
            return;
        }
        end = performance.now();
    } while (end - start < 3);
    requestAnimationFrame(doTheSplits);
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
        requestAnimationFrame(doTheSplits);
    }
}

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        items[msg.index].wrapNumbers(msg.colors);
    }
);

/**
 * create node iterator, start loop
 */
void function initIterator () {
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
}();