var DOM_VISUALIZER = DOM_VISUALIZER || {};

(function (ns) {
    'use strict';

    /**
     *
     * @constructor
     */
    ns.Drawer = function Drawer(d3_svg) {
        var that = this,
            svg = d3_svg,
            font_size = 14;

        function reset_need_width() {
            _.each(nodes, function () {
                nodes.need_width = null;
            });
        }

        function draw_nodes() {
            svg.selectAll('ellipse')
                .data(nodes, function (d) { return d.id; })
                .enter()
                .append('ellipse')
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; })
                .attr('rx', function (d) { return d.rx; })
                .attr('ry', function (d) { return d.ry; })
                .attr('fill', '#1abc9c');
        }

        function draw_texts() {
            svg.selectAll('text')
                .data(nodes, function (d) { return d.id; })
                .enter()
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y + font_size / 4; })
                .attr('fill', 'black')
                .attr('font-size', font_size)
                .text(function (d) {
                    // 表示テキストは後で調整する
//                    return d.name || (_.isString(d.text) ? _.truncate(d.text, truncate_text_length) : 'null');
                    return d.name ? ('<' + d.name + '>') : '#text';
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

        that.draw = function update() {
            draw_edges();
            draw_nodes();
            draw_texts();
        };
    };

}(DOM_VISUALIZER));