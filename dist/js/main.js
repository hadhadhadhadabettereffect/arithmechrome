(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var iterator, styleNode;
var colors, nodes = [];
class ColorDigit extends HTMLSpanElement {
}
document.addEventListener("DOMContentLoaded", function (event) {
    window.customElements.define("colordigit", ColorDigit);
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    colors = msg.colors;
    if (msg.active) {
        requestAnimationFrame(writeCSS);
        if (!iterator)
            startIterator();
    }
    else {
        requestAnimationFrame(removeCSS);
    }
});
/**
 * traverse dom via node iterator, wrap digits with styled spans
 */
function wrapNumbers() {
    var end, start = performance.now();
    let currentNode = iterator.nextNode();
    do {
        // if text node contains any number chars
        if (currentNode && /\d/.test(currentNode.textContent)) {
            // storing a ref to the node in an array to avoid changing the dom
            // while the iterator is still going over the original dom
            nodes.push(currentNode);
        }
        if (!(currentNode = iterator.nextNode()))
            break;
        end = performance.now();
    } while (end - start < 3);
    if (currentNode)
        requestAnimationFrame(wrapNumbers);
    else {
        // reversing order so calling nodes.pop() updates from top to bottom
        nodes = nodes.reverse();
        requestAnimationFrame(swapHTML);
    }
}
/**
 * for each node in the nodes array, wrap digit chars with spans
 * and assign css class names based on the wrapped digits
 */
function swapHTML() {
    var end, start = performance.now();
    var el;
    do {
        if (!nodes.length)
            break;
        el = nodes.pop();
        el.innerHTML = el.textContent.replace(/\d/g, "<colordigit class='n$&'>$&</colordigit>");
    } while (end - start < 3);
    if (nodes.length)
        requestAnimationFrame(swapHTML);
}
/**
 * create node iterator, start loop
 */
function startIterator() {
    iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, function (node) {
        return (node.firstChild &&
            // first child is a text node
            node.firstChild.nodeType === 3 /* Node.TEXT_NODE */ &&
            // is not a script/style tag
            node.nodeName != "SCRIPT" &&
            node.nodeName != "NOSCRIPT" &&
            node.nodeName != "STYLE" &&
            // text contains a digit
            /\d/.test(node.firstChild.textContent)) ?
            1 /* NodeFilter.FILTER_ACCEPT */ :
            2 /* NodeFilter.FILTER_REJECT */;
    });
    requestAnimationFrame(wrapNumbers);
}
/**
 * add style tag to head with color options
 */
function writeCSS() {
    if (!styleNode) {
        styleNode = document.createElement("style");
        document.head.appendChild(styleNode);
    }
    var styleText = "colordigit{background:" + colors[10] + "}";
    for (let i = 0; i < 10; ++i) {
        styleText += "colordigit.n" + i + "{color:" + colors[i] + "}";
    }
    styleNode.innerHTML = styleText;
}
/*
 *
 */
function removeCSS() {
    if (styleNode) {
        document.head.removeChild(styleNode);
        styleNode = null;
    }
}

},{}]},{},[1,2]);
