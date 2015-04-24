var ER = ER || {};


ER.queryParagraphs = function() {

    var corresponding = [];
    var single = [];

    var _getParagraphs = function() {
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

            if(parent === 'HTML') {
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

    var _getHeadline = function(parNode) {
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

    var finalParagraphs = [];

    for (var i in single) {
        var h = _getHeadline(single[i]);
        $(single[i]).wrap('<paragraph-directive paragraph="single[i]"></paragraph-directive>');
        finalParagraphs.push({
            headline: $(h).text(),
            content: $(single[i]).text()
        });
    }
    for (var i in corresponding) {
        var h = _getHeadline(corresponding[i][0]);
        var text = '';
        var tmpCorr = $(corresponding[i]);
        for (var k = 0; k < corresponding[i].length; k++) {
            text += $(corresponding[i][k]).text();
        }
        tmpCorr.wrapAll('<paragraph-directive paragraph="tempCorr"></paragraph-directive>');
        finalParagraphs.push({
            headline: $(h).text(),
            content: text
        });
    }

    ER.messaging.callBG({method: {parent: 'keywords', func: 'getParagraphEntityTypes'}, data: finalParagraphs}, function(result) {
        console.log("getParagraphEntityTypes results are: ");
        console.log(result);
    });
    ER.messaging.callBG({method: {parent: 'keywords', func: 'getParagraphEntities'}, data: finalParagraphs}, function(result) {
        console.log("getParagraphEntities results are: ");
        console.log(result);
    });
}();


