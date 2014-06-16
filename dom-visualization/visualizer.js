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
            dom = $(),
            edges = [],
            nodes = [];

        function compute_positions() {

        }

        function draw_all() {
            // 仮
            svg.selectAll('text')
                .data(nodes)
                .enter()
                .append('text')
                .attr('x', function (d, i) {
                    return 10 + i * 50;
                })
                .attr('y', function (d) {
                    return d.depth * 50;
                })
                .text(function (d) {
                    return d.name || (_.isString(d.text) ? d.text.slice(0, 5) : 'null');
                });
        }

        function create_node(ele, depth) {
            $(ele).contents().filter(function () {
                // 要素ノードか非空文字テキストノードのみ許可
                return _.contains([1, 3], this.nodeType) &&
                       !ns.util.isEmptyTextNode(this);
            }).each(function () {
                nodes.push(new ns.Node(this, {
                    depth: depth
                }));

                create_node(this, depth + 1);
            });
        }

        that.init = function init(dom_text) {
            dom = '<DomVisualizer>' + ns.util.replaceTagNames(dom_text) + '</DomVisualizer>';
            edges = [];
            nodes = [];
            create_node(dom, 1);

            that.update();
        };

        that.update = function update() {
            compute_positions();
            draw_all();
        };
    };

}(DOM_VISUALIZER));