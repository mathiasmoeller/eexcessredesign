var ER = ER || {};
var processedParagraphs = {};

ER.queryParagraphs = function () {

    var corresponding = [];
    var single = [];

    // replaces all link elements with a custom directive to enable double click selection
    var _replaceLinks = function () {
        $('paragraph-directive').each(function () {
            $(this).find('a').each(function() {
                var attributes = '';
                for (var i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
                    if (atts[i].nodeName !== 'href') {
                        attributes = attributes.concat(' ' + atts[i].nodeName + '="' + atts[i].nodeValue + '"');
                    }
                }
                var ref = $(this).attr('href');
                var text = $(this).html();

                $(this).replaceWith('<anchor anchor-ref="' + ref + '" ' + attributes + '>' + text + '</anchor>')
            })
        })
    };

    var _getParagraphs = function () {
        var pars = [];
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        var node;
        while (node = walker.nextNode()) {
            var containsText = node.nodeValue.search(/\S+/);
            var parent = node.parentNode.nodeName;
            var cond1 = parent !== 'SCRIPT'; // exclude script areas
            var cond2 = parent !== 'STYLE';  // exclude style areas
            var cond3 = parent !== 'NOSCRIPT'; // exclude noscript areas
            var cond4 = parent !== 'A';
            var minLength = node.nodeValue.length > 40;

            if (parent === 'HTML') {
                console.log(parent);

            }

            if (containsText !== -1 && cond1 && cond2 && cond3 && minLength) {
                if (pars.indexOf(node.parentNode) === -1) {
                    pars.push(node.parentNode);
                }
            }
        }
        return pars;
    };

    var _getHeadline = function (parNode) {
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT
        );

        var node = parNode;
        walker.currentNode = node;
        while (node = walker.previousNode()) {
            if (node.nodeName.indexOf('H') === 0) {
                return node;
            }
        }
        return null;
    };

    var paragraphs = _getParagraphs();

    for (var i = 0; i < paragraphs.length; i++) {
        var next = paragraphs[i].nextSibling;
        var sole = true;
        var j = i;
        var neighbours = [];
        while (next !== null) {
            if (next.nodeName !== '#text') {
                var idx = $.inArray(next, paragraphs, j);
                if (idx > -1) {
                    j = idx;
                    neighbours.push(paragraphs[j]);
                    sole = false;
                    next = next.nextSibling;
                } else {
                    next = null;
                }
            } else {
                next = next.nextSibling;
            }
        }
        if (sole) {
            var text = $(paragraphs[i]).text();
            if (text.length > 100 && text.indexOf('.') > -1) {
                single.push(paragraphs[i]);
            }
        } else {
            neighbours.unshift(paragraphs[i]);
            corresponding.push(neighbours);
            i = j;
        }
    }

    var finalParagraphs = {};
    var id = 0;

    for (var i in single) {
        var h = _getHeadline(single[i]);
        $(single[i]).wrap('<paragraph-directive id="' + id + '"></paragraph-directive>');
        finalParagraphs[id] = {
            headline: $(h).text(),
            content: $(single[i]).text()
        };
        id++;
    }
    for (var i in corresponding) {
        var h = _getHeadline(corresponding[i][0]);
        var text = '';
        var tmpCorr = $(corresponding[i]);
        for (var k = 0; k < corresponding[i].length; k++) {
            text += $(corresponding[i][k]).text();
        }
        tmpCorr.wrapAll('<paragraph-directive id="' + id + '"></paragraph-directive>');
        finalParagraphs[id] = {
            headline: $(h).text(),
            content: text
        };
        id++;
    }
    _replaceLinks();
    processedParagraphs = finalParagraphs;
}();

ER.paragraphs = function () {
    return {
        getParagraphs: function () {
            return processedParagraphs;
        },
        getParagraph: function (id) {
            return processedParagraphs[id];
        }
    }
}();
