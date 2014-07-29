var DOM_VISUALIZER = DOM_VISUALIZER || {};

(function (ns) {
    'use strict';

    var id = 0;

    /**
     *
     * @constructor
     */
    ns.Node = function Node(ele, o) {
        var that = this;
        this.name = 'node';
        this.id = id++;
        this.x = 0;
        this.y = 0;
        this.rx = 0;
        this.ry = 0;
        // 子ノードも含めた必要な横幅
        this.needWidth = 0;
        this.type = ele.nodeType;
        this.tagName = ns.util.decodeTagName(ele.tagName);
        this.text = {
            name: 'text',
            node: that,
            value: _.isString(ele.nodeValue) ? ele.nodeValue.trim() : null,
            displayText: that.tagName ? ('<' + that.tagName + '>') : '#text'
        };
        this.parent = null;
        this.childs = [];
        this.nodeType = ele.nodeType;
        _.extend(this, o);
    };

    ns.Node.prototype.reset = function () {
        id = 0;
    };

}(DOM_VISUALIZER || {}));