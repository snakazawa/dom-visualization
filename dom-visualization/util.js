var DOM_VISUALIZER = DOM_VISUALIZER || {};

(function (ns) {
    'use strict';

    var ws_pattern = /^(\t|\n|\r|\s)*$/,
        replace_tag_list = {
            html: 'lmth',
            body: 'ydob',
            head: 'daeh'
        },
        replace_tag_list_invert = _.invert(replace_tag_list);

    ns.util = {
        isEmptyTextNode: function (node) {
            return node.nodeType === 3 &&
                   ws_pattern.test(node.data);
        },

        replaceTagNames: function (html) {
            return html.replace(/<(\/?)([a-zA-Z]+)(\/?)>/g, function (str, s1, name, s2) {
                return '<' + s1 + ns.util.encodeTagName(name) + s2 + '>';
            });
        },

        encodeTagName: function (tag_name) {
            if (!_.isString(tag_name)) { return tag_name; }
            var lower = tag_name.toLowerCase(),
                new_tag_name = replace_tag_list[lower];
            return new_tag_name === undefined ? lower : new_tag_name;
        },

        decodeTagName: function (tag_name) {
            if (!_.isString(tag_name)) { return tag_name; }
            var lower = tag_name.toLowerCase(),
                new_tag_name = replace_tag_list_invert[lower];
            return new_tag_name === undefined ? lower : new_tag_name;
        }
    };

}(DOM_VISUALIZER));