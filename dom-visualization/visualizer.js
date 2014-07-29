var DOM_VISUALIZER = DOM_VISUALIZER || {};

(function (ns) {
    'use strict';

    var z_order = ['line', 'node', 'text'],
        colors = ['#e67e22', '#1abc9c', '', '#3498db'];

    /**
     *
     * @constructor
     */
    ns.Visualizer = function Visualizer(d3_svg) {
        var that = this,
            svg = d3_svg,
            zoom,
            dom,
            nodes = [],
            min_margin_horizontal = 15,
            min_margin_vertical = 80,
            font_size = 14,
            node_rx = 35,
            node_ry = 20,
            offset = d3_svg.attr('width') / 2;

        /**
         * zoom
         *
         */
        zoom = d3.behavior.zoom()
            .scaleExtent([0.01, 10])
            .on('zoom', zoomed);

        svg.call(zoom);

        function zoomed() {
            svg.selectAll('*')
                .attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }

        function zoom_reset() {
            svg.selectAll('*')
                .attr('transform', 'translate(0, 0)scale(1)');
        }

        /**
         * 各ノードの配置を計算する
         *
         */
        function compute_positions() {
            compute_need_width();

            nodes[0].x = 0;
            nodes[0].y = nodes[0].rx * 2 + 10;
            (function solve(node) {
                var l = node.x - node.needWidth / 2,
                    y = node.y + min_margin_vertical;

                node.childs.forEach(function (child) {
                    child.y = y;
                    child.x = l + child.needWidth / 2;
                    l += child.needWidth + min_margin_horizontal;
                    solve(child);
                });
            }(nodes[0]));

            nodes.forEach(function (node) {
                node.x += offset;
            });
        }

        /**
         * 子ノードも含めた必要な横幅を計算する
         * V = ノードの集合
         * Vi ∈ V, Vj ∈ Viの子ノード, n = Viの子ノードの数,
         * h = 兄弟ノード間の最小マージン
         * Vir = Viの半径, Viw = Viの必要な横幅 とすると
         * Viw = {
         *   2r (n = 0),
         *   Σ[j=0...n-1](Vjr) + (n - 1) * v (n != 0)
         * }
         * となる
         *
         */
        function compute_need_width() {
            reset_need_width();

            var solve = function (node) {
                if (node.needWidth) {
                    return node.needWidth;
                }

                if (!node.childs.length) {
                    node.needWidth = node.rx * 2;
                    return node.needWidth;
                } else {
                    node.needWidth = node.childs.reduce(function (sum, child) {
                        return sum + solve(child, node.childs.length > 1);
                    }, (node.childs.length - 1) * min_margin_horizontal);
                }

                return node.needWidth;
            };

            nodes.forEach(solve);
        }

        function reset_need_width() {
            nodes.forEach(function (node) {
                node.node_width = null;
            });
        }

        function draw_nodes() {
            var ellipse = svg.selectAll('ellipse').data(nodes, function (d) { return d.id; });

            ellipse.enter().append('ellipse');

            ellipse.exit().remove();

            ellipse
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; })
                .attr('rx', function (d) { return d.rx; })
                .attr('ry', function (d) { return d.ry; })
                .attr('fill', function (d) { return colors[d.nodeType]; });
        }

        function draw_texts() {
            var texts = nodes.map(function (node) { return node.text; }),
                text = svg.selectAll('text').data(texts, function (d) { return d.node.id; });

            text.enter().append('text');

            text.exit().remove();

            text
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('font-size', font_size)
                .attr('x', function (d) { return d.node.x; })
                .attr('y', function (d) { return d.node.y + font_size / 4; })
                .text(function (d) { return d.displayText; });
        }

        function draw_edges() {
            var edges = [], line;

            nodes.forEach(function (parent) {
                parent.childs.forEach(function (child) {
                    edges.push({
                        name: 'line',
                        parent: parent,
                        child: child
                    });
                });
            });

            line = svg.selectAll('line').data(edges, function (d) { return d.parent.id + '-' + d.child.id; });

            line.enter().append('line');

            line.exit().remove();

            line
                .attr('stroke', '#e67e22')
                .attr('stroke-width', 1)
                .attr('x1', function (d) { return d.parent.x; })
                .attr('y1', function (d) { return d.parent.y; })
                .attr('x2', function (d) { return d.child.x; })
                .attr('y2', function (d) { return d.child.y; });

        }

        function create_node(ele, depth, parent) {
            var node = new ns.Node(ele, {
                depth: depth,
                parent: parent,
                rx: node_rx,
                ry: node_ry
            });

            if (depth === 1) {
                node.nodeType = 0;
            }

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

        function z_sort() {
            svg.selectAll('*').sort(function (a, b) {
                return z_order.indexOf(a.name) - z_order.indexOf(b.name);
            });
        }

        that.init = function init(dom_text) {
            dom = document.createElement('root');
            dom.innerHTML = ns.util.replaceTagNames(dom_text);
            nodes = [];
            ns.Node.prototype.reset();
            create_node(dom, 1);

            that.update();
        };

        that.update = function update() {
            compute_positions();
            zoom_reset();
            draw_edges();
            draw_nodes();
            draw_texts();
            z_sort();
        };
    };

}(DOM_VISUALIZER));