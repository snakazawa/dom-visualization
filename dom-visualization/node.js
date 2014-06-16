var DOM_VISUALIZER = DOM_VISUALIZER || {};

(function (ns) {
    'use strict';

    /**
     *
     * @constructor
     */
    ns.Node = function Node(ele, o) {
        this.x = 0;
        this.y = 0;
        this.type = ele.nodeType;
        this.name = ns.util.decodeTagName(ele.tagName);
        this.text = _.isString(ele.nodeValue) ? ele.nodeValue.trim() : null;
        _.extend(this, o);
    };

}(DOM_VISUALIZER || {}));