var DOM_VISUALIZER = DOM_VISUALIZER || {};

(function (ns) {
    'use strict';

    /**
     *
     * @constructor
     */
    ns.Visualizer = function Visualizer(d3_svg) {
        var that = this,
            svg = d3_svg,
            w = svg.attr('width'),
            h = svg.attr('height'),
            dom,
            edges = [],
            nodes = [],
            min_margin_horizontal = 30,
            min_margin_vertical = 30,
            truncate_text_length = 5;

        function compute_positions() {
            _.each(nodes, function (node) {
                node.y = min_margin_vertical * node.depth;
                node.x = Math.random() * 500;
            });
        }

        function draw_nodes() {
            svg.selectAll('text')
                .data(nodes)
                .enter()
                .append('text')
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; })
                .text(function (d) {
                    // 表示テキストは後で調整する
                    return d.name || (_.isString(d.text) ? _.truncate(d.text, truncate_text_length) : 'null');
                });
        }

        function draw_edges() {
            svg.selectAll('line')
                .data(edges)
                .enter()
                .append('line')
                .attr('x1', function (d) { return d.from.x; })
                .attr('y1', function (d) { return d.from.y; })
                .attr('x2', function (d) { return d.to.x; })
                .attr('y2', function (d) { return d.to.y; })
                .attr('stroke', 'blue')
                .attr('stroke-width', 1);
        }

        function create_node(ele, depth, parent) {
            var node = new ns.Node(ele, {
                depth: depth
            });
            nodes.push(node);

            if (parent !== undefined) {
                edges.push({
                    from: parent,
                    to: node
                });
            }

            $(ele).contents().filter(function () {
                // 要素ノードか非空文字テキストノードのみ許可
                return _.contains([1, 3], this.nodeType) &&
                       !ns.util.isEmptyTextNode(this);
            }).each(function () {
                create_node(this, depth + 1, node);
            });
        }

        that.init = function init(dom_text) {
            dom = document.createElement('Root');
            dom.innerHTML = ns.util.replaceTagNames(dom_text);
            edges = [];
            nodes = [];
            create_node(dom, 1);

            that.update();
        };

        that.update = function update() {
            compute_positions();
            draw_edges();
            draw_nodes();
        };
    };

}(DOM_VISUALIZER));