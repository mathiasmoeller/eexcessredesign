angular
    .module('eRedesign', [
        'ngAnimate',
        'ngMaterial'
    ]);

ER = ER || {};


ER.messaging.listener(function(request, sender, sendResponse) {
    console.log("forground listens");
    console.log(request);
    if (request.method.parent === 'results' && request.method.func === 'error' && typeof request.data['query'] !== 'undefined') {
        ER[request.method](request.data);
    }
});
