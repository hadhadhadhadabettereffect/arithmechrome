(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var defaults_1 = require("./defaults");
var activeIcons = {
    "16": "icons/active/icon16.png",
    "24": "icons/active/icon24.png",
    "32": "icons/active/icon32.png"
};
var inactiveIcons = {
    "16": "icons/inactive/icon16.png",
    "24": "icons/inactive/icon24.png",
    "32": "icons/inactive/icon32.png"
};
var options = defaults_1.options;
chrome.storage.onChanged.addListener(onOptionsUpdate);
chrome.tabs.onUpdated.addListener(onTabsUpdate);
chrome.storage.sync.get(defaults_1.options, function (storedOptions) {
    options = storedOptions;
    if (options.active)
        msgTab();
    else
        updateIcon();
});
function onTabsUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
        chrome.tabs.sendMessage(tabId, options.colors);
    }
}
function onOptionsUpdate(changes, areaName) {
    if (areaName == "sync") {
        if (changes.hasOwnProperty("active")) {
            options.active = changes.active.newValue;
            updateIcon();
            if (options.active) {
                // send parse msg to active tab if not on ignore list
                // the send parse msg to open tabs not on ignore list
            }
            else {
                // send parse msg if current tab not on ignore list
            }
        }
        if (changes.hasOwnProperty("ignore")) {
        }
        if (changes.hasOwnProperty("colors")) {
            options.colors = changes.colors.newValue;
            // if options.active
            // send msg to current tab, the each tab not on the ignore list
            msgTab();
        }
    }
}
function msgTab() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, options.colors);
    });
}
function updateIcon() {
    chrome.browserAction.setIcon({ path: options.active ?
            activeIcons : inactiveIcons });
}

},{"./defaults":2}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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
        "#6b0000" // maroon
    ],
    active: true,
    onlybody: false,
    useBackground: false,
    backgroundColor: "#eeeeee"
};

},{}],3:[function(require,module,exports){

},{}]},{},[3,1]);
