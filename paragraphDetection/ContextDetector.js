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

    var showEntities = function() {
        ER.messaging.callBG({method: {parent: 'NER', func: 'getParagraphEntities'}, data: finalParagraphs}, function(result) {
            var addEntities = function(prefix, i, id) {
                var img = $('<img src="chrome-extension://' + ER.utils.extID + '/media/icons/16.png" style="margin:0;padding:0;" />');
                $('#' + prefix + id).prepend(img);
                var entities = '';
                for (var j = 0; j < result.paragraphs[i].statistic.length; j++) {
                    if (j < result.paragraphs[i].statistic.length - 1) {
                        entities += ' ' + result.paragraphs[i].statistic[j].key.text + ' |';
                    } else {
                        entities += ' ' + result.paragraphs[i].statistic[j].key.text;
                    }
                }
                img.after('<span style="color:#1D904E;font-weight:bold;">' + entities + '</span>');
            };

            for (var i = 0; i < result.paragraphs.length; i++) {
                if (i < single.length) {
                    addEntities('eexcess_s', i, i);
                } else {
                    addEntities('eexcess_c', i, i - single.length);
                }
            }
            console.log(result);
        });
    };

    //ER.messaging.callBG({method: {parent: 'keywords', func: 'getParagraphEntityTypes'}, data: finalParagraphs}, function(result) {
    //    console.log("getParagraphEntityTypes results are: ");
    //    console.log(result);
    //});
    //ER.messaging.callBG({method: {parent: 'keywords', func: 'getParagraphEntities'}, data: finalParagraphs}, function(result) {
    //    console.log("getParagraphEntities results are: ");
    //    console.log(result);
    //});
        //var valueStr = function(val) {
        //    if (val === 1) {
        //        return '';
        //    }
        //    return '<span style="color:gray;font-weight:normal"> ' + val + '</span>';
        //};
        //var increment = function(dict, key, val, weight) {
        //    if (key in dict) {
        //        dict[key].count += weight;
        //        dict[key].occurrences += 1;
        //    } else {
        //        dict[key] = val;
        //        val.count = weight;
        //        val.occurrences = 1;
        //    }
        //};
        //
        //var addCategories = function(el, i, threshold) {
        //
        //    var categories = {};
        //    for (var j = 0; j < result.paragraphs[i].statistic.length; j++) {
        //        var current = result.paragraphs[i].statistic[j];
        //        for (var k = 0; k < current.key.categories.length; k++) {
        //            increment(categories, current.key.categories[k].uri, current.key.categories[k], current.value);
        //        }
        //    }
        //    categories = Object.keys(categories).map(function(key) {
        //        return categories[key];
        //    });
        //    categories.sort(function(a, b) {
        //        return b.count - a.count;
        //    });
        //    var categories_html = '';
        //    for (var j = 0; j < categories.length; j++) {
        //        if (categories[j].occurrences > threshold) {
        //            if (j < categories.length - 1) {
        //                categories_html += ' ' + categories[j].name + valueStr(categories[j].count) + '@' + valueStr(categories[j].occurrences) + ' |';
        //            } else {
        //                categories_html += ' ' + categories[j].name + valueStr(categories[j].count) + '@' + valueStr(categories[j].occurrences);
        //            }
        //        }
        //    }
        //    categories_html += '<hr/>';
        //    el.prepend('<span style="color:red;font-weight:bold;">' + categories_html + '</span>');
        //};
        //
        //
        //var addEntities = function(el, i) {
        //    var entities = '';
        //    result.paragraphs[i].statistic.sort(function(a,b){return b.value - a.value});
        //    for (var j = 0; j < result.paragraphs[i].statistic.length; j++) {
        //        if (j < result.paragraphs[i].statistic.length - 1) {
        //            entities += ' ' + result.paragraphs[i].statistic[j].key.text + valueStr(result.paragraphs[i].statistic[j].value) +' |';
        //        } else {
        //            entities += ' ' + result.paragraphs[i].statistic[j].key.text + valueStr(result.paragraphs[i].statistic[j].value);
        //        }
        //    }
        //    el.prepend('<span style="color:#1D904E;font-weight:bold;">' + entities + '</span>');
        //};
        //
        //var threshold = 1;
        //for (var i = 0; i < result.paragraphs.length; i++) {
        //    if (i < single.length) {
        //        var el = $('#' + 'eexcess_s' + i);
        //        addEntities(el, i);
        //        addCategories(el, i, threshold);
        //    } else {
        //        var el = $('#' + 'eexcess_c' + (i - single.length));
        //        addEntities(el, i);
        //        addCategories(el, i, threshold);
        //    }
        //}
        //console.log(result);
    //});
}();


