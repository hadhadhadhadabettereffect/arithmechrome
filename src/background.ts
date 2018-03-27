import { options as defaultOptions } from "./defaults";

var options = defaultOptions;

chrome.webNavigation.onHistoryStateUpdated.addListener(onAfterNavigate);
chrome.webNavigation.onDOMContentLoaded.addListener(onAfterNavigate);
chrome.storage.onChanged.addListener(onOptionsUpdate);

function onAfterNavigate (details) {
    // if options.active is true
    // and details.url not in ignore list
    chrome.tabs.sendMessage(details.tabId, options.colors);
}

function onOptionsUpdate (changes, areaName) {
    if (areaName == "sync"){
        if (changes.hasOwnProperty("active")) {
            options.active = changes.active.newValue;
            if (options.active) {
                // send parse msg to active tab if not on ignore list
                // the send parse msg to open tabs not on ignore list
            } else {
                // send parse msg if current tab not on ignore list
            }
        }
        if (changes.hasOwnProperty("ignore")) {

        }
        if (changes.hasOwnProperty("colors")) {
            options.colors = changes.colors.newValue;
            // if options.active
            // send msg to current tab, the each tab not on the ignore list
            chrome.tabs.query({currentWindow: true, active: true},
                function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, options.colors);
            });
        }
    }
}
