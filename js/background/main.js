var busy = false;
var queue = [];
var individual = false;

function checkNextColor() {
    var obj = queue.pop();
    chrome.tabs.sendMessage(obj.id, {
        msgType: "colors",
        index: obj.data.index,
        colors: obj.data.values.map(colorValue)
    });
    if (queue.length) setTimeout(checkNextColor, 0);
    else busy = false;
}

function setStoredValues(items) {
    rgb_values = items.values;
    individual = items.individual;
    setActive(Boolean(items.active));
}

chrome.storage.sync.get({
    individual: individual,
    values: rgb_values,
    active: active
}, setStoredValues);

chrome.storage.onChanged.addListener(setStoredValues);

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