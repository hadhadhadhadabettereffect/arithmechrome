function SplitText(node) {
    this.node = node;
}

/**
 * split text node to isolate number
 * @return {boolean} true if a number was found and text was split
 */
SplitText.prototype.split = function () {
    var tailnode, textnode = this.node.lastChild;
    var i = textnode.data.search(/\d/);
    if (i === -1) return false;
    ++this.count;
    tailnode = textnode.splitText(i);
    i = tailnode.data.search(/\D/);
    if (~i) tailnode.splitText(i);
    return true;
};

/**
 * @return {number[]} an array of numbers found in text
 */
SplitText.prototype.getNumbers = function () {
    // if firstchild is not a number string starting offset == 1
    var i = /^\d/.test(this.node.firstChild.data) ? 0 : 1;
    var children = this.node.childNodes;
    var count = children.length;
    var numbers = [];
    while (i < count) {
        numbers.push(parseInt(children[i].data));
        i += 2;
    }
    return numbers;
};

/**
 * wrap number strings in text with a span tag
 * @param {string[]} color - hex color strings
 */
SplitText.prototype.wrapNumbers = function (colors) {
    var offset = /^\d/.test(this.node.firstChild.data) ? 0 : 1;
    var node = this.node;
    var children = node.childNodes;
    for (var i = 0, j = (children.length >> 1); i < j; ++i) {
        var child = children[offset + i * 2];
        var span = document.createElement("span");
        span.style.color = colors[i];
        node.insertBefore(span, child);
        span.appendChild(child);
    }
    node.normalize();
};