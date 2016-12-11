var busy = false;
var queue = [];

function checkNextColor() {
    var obj = queue.pop();
    chrome.tabs.sendMessage(obj.id, {
        index: obj.data.index,
        colors: obj.data.values.map(colorValue)
    });
    if (queue.length) setTimeout(checkNextColor, 0);
    else busy = false;
}

/**
 * add message data to queue, start loop if not running
 */
chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    queue.push({
        id: sender.tab.id,
        data: msg
    });
    if (!busy) {
        busy = true;
        setTimeout(checkNextColor, 0);
    }
  }
);