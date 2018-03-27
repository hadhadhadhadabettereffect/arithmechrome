(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var iterator;
var cap = 0;
function wrapNumbers() {
    var end, start = performance.now();
    var currentNode = iterator.nextNode();
    do {
        if (currentNode && /\d/.test(currentNode.textContent)) {
            var text = currentNode.textContent;
            if (++cap < 8)
                console.log(currentNode, text);
            text.replace(/\d/g, "<span class='digit--$&'>$&</span>");
            currentNode.innerHTML = text;
        }
        if (!(currentNode = iterator.nextNode()))
            break;
        end = performance.now();
    } while (end - start < 3);
    if (currentNode)
        requestAnimationFrame(wrapNumbers);
    else {
        console.log("dun");
    }
}
/**
 * create node iterator, start loop
 */
function startIterator() {
    iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, function (node) {
        return (node.firstChild &&
            // first child is a text node
            node.firstChild.nodeType === 3 /* Node.TEXT_NODE */ &&
            // is not a script tag
            node.nodeName != "SCRIPT" &&
            // text contains a digit
            /\d/.test(node.firstChild.textContent)) ?
            1 /* NodeFilter.FILTER_ACCEPT */ :
            2 /* NodeFilter.FILTER_REJECT */;
    });
    // setTimeout(iterate, 0);
    requestAnimationFrame(wrapNumbers);
}
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log(msg);
    switch (msg.msgType) {
        case 0 /* parse */:
            startIterator();
            console.log("parse");
            break;
        case 3 /* color */:
            console.log("color");
    }
});

},{}]},{},[1,2]);
