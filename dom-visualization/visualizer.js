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
            dom,
            nodes = [],
            min_margin_horizontal = 30,
            min_margin_vertical = 30,
            truncate_text_length = 5,
            offset = d3_svg.attr("width") / 2;

        function compute_positions() {
//            var width = 0;
            _.each(nodes, function (node) {
                node.y = min_margin_vertical * node.depth;
                node.x = Math.random() * 1000;
            });
        }

        function draw_nodes() {
            svg.selectAll('circle')
                .data(nodes, function (d) { return d.id; })
                .enter()
                .append('circle')
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; })
                .attr('r', function (d) { return d.r; })
                .attr('fill', '#1abc9c');
        }

        function draw_texts() {
            svg.selectAll('text')
                .data(nodes, function (d) { return d.id; })
                .enter()
                .append('text')
                .attr('x', function (d) { return d.x - d.r / 2; })
                .attr('y', function (d) { return d.y; })
                .attr('fill', 'black')
                .text(function (d) {
                    // 表示テキストは後で調整する
                    return d.name || (_.isString(d.text) ? _.truncate(d.text, truncate_text_length) : 'null');
                });
        }

        function draw_edges() {
            _.each(nodes, function (parent) {
                svg.selectAll('line')
                    .data(parent.childs, function (d) { return parent.id + '-' + d.id; })
                    .enter()
                    .append('line')
                    .attr('x1', parent.x)
                    .attr('y1', parent.y)
                    .attr('x2', function (d) { return d.x; })
                    .attr('y2', function (d) { return d.y; })
                    .attr('stroke', '#e67e22')
                    .attr('stroke-width', 1);
            });
        }

        function create_node(ele, depth, parent) {
            var node = new ns.Node(ele, {
                depth: depth,
                parent: parent
            });
            nodes.push(node);

            $(ele).contents().filter(function () {
                // 要素ノードか非空文字テキストノードのみ許可
                return _.contains([1, 3], this.nodeType) &&
                       !ns.util.isEmptyTextNode(this);
            }).each(function () {
                node.childs.push(create_node(this, depth + 1, node));
            });

            return node;
        }

        that.init = function init(dom_text) {
            dom = document.createElement('Root');
            dom.innerHTML = ns.util.replaceTagNames(dom_text);
            nodes = [];
            create_node(dom, 1);

            that.update();
        };

        that.update = function update() {
            compute_positions();
            draw_edges();
            draw_nodes();
            draw_texts();
        };
    };

}(DOM_VISUALIZER));