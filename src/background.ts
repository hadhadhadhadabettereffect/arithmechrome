chrome.webNavigation.onHistoryStateUpdated.addListener(onAfterNavigate);
chrome.webNavigation.onDOMContentLoaded.addListener(onAfterNavigate);

function onAfterNavigate (details) {
     chrome.tabs.sendMessage(details.tabId, {
        msgType: MsgType.parse,
        url: details.url
    });
}