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
            offset = d3_svg.attr('width') / 2;

        function compute_positions() {
            compute_need_width();

            nodes[0].x = 0;
            nodes[0].y = nodes[0].r * 2 + 10;
            (function solve(node) {
                var l = node.x - node.need_width / 2,
                    y = node.y + min_margin_vertical;

                _.each(node.childs, function (child) {
                    child.y = y;
                    child.x = l + child.w / 2;
                    l += child.w;
                    solve(child);
                });
            }(nodes[0]));

            _.each(nodes, function (node) {
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
                if (node.need_width) {
                    return node.need_width;
                }

                if (!node.childs.length) {
                    node.need_width = node.r * 2;
                    return node.need_width;
                } else {
                    node.need_width = _.reduce(node.childs, function (sum, child) {
                        return sum + solve(child);
                    }, (node.childs.length - 1) * min_margin_horizontal);
                }

                return node.need_width;
            };

            _.each(nodes, solve);
        }

        function reset_need_width() {
            _.each(nodes, function () {
                nodes.need_width = null;
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