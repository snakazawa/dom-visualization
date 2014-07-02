var DOM_VISUALIZER = DOM_VISUALIZER || {};

(function (ns) {
    'use strict';

    var id = 0;

    /**
     *
     * @constructor
     */
    ns.Node = function Node(ele, o) {
        this.id = id++;
        this.x = 0;
        this.y = 0;
        this.rx = 0;
        this.ry = 0;
        // 子ノードも含めた必要な横幅
        this.need_width = 0;
        this.type = ele.nodeType;
        this.name = ns.util.decodeTagName(ele.tagName);
        this.text = _.isString(ele.nodeValue) ? ele.nodeValue.trim() : null;
        this.parent = null;
        this.childs = [];
        _.extend(this, o);
    };

    ns.Node.prototype.reset = function () {
        id = 0;
    };

}(DOM_VISUALIZER || {}));