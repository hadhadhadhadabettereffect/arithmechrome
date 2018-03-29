(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("./defaults");
const activeIcons = {
    "16": "icons/active/icon16.png",
    "24": "icons/active/icon24.png",
    "32": "icons/active/icon32.png"
};
const inactiveIcons = {
    "16": "icons/inactive/icon16.png",
    "24": "icons/inactive/icon24.png",
    "32": "icons/inactive/icon32.png"
};
var options = defaults_1.options;
chrome.storage.onChanged.addListener(onOptionsUpdate);
chrome.tabs.onUpdated.addListener(onTabsUpdate);
chrome.tabs.onActivated.addListener(onTabChange);
chrome.storage.sync.get(defaults_1.options, function (storedOptions) {
    options = storedOptions;
    if (options.active)
        msgTab();
    else
        updateIcon();
});
chrome.browserAction.onClicked.addListener(function (tab) {
    options.active = !options.active;
    chrome.storage.sync.set(options);
});
function onTabChange(activeInfo) {
    // check if url is in list
    chrome.tabs.sendMessage(activeInfo.tabId, {
        active: options.active,
        colors: options.colors
    });
}
function onTabsUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
        chrome.tabs.sendMessage(tabId, {
            active: options.active,
            colors: options.colors
        });
    }
}
function onOptionsUpdate(changes, areaName) {
    if (areaName == "sync") {
        for (let k in changes)
            options[k] = changes[k].newValue;
        if (changes.hasOwnProperty("active"))
            updateIcon();
        msgTab();
    }
}
function msgTab() {
    // send msg to active tab
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            active: options.active,
            colors: options.colors
        });
    });
}
function updateIcon() {
    chrome.browserAction.setIcon({ path: options.active ?
            activeIcons : inactiveIcons });
}

},{"./defaults":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = {
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

},{}],3:[function(require,module,exports){

},{}]},{},[3,1]);
