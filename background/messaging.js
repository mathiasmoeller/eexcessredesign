var ER = ER || {};

// listen for incoming messages
ER.messaging.listener(
    function(request, sender, sendResponse) {

        if (typeof sender.tab === 'undefined') {
            // sender cannot be identified, exit
            console.log('no tab');
        } else {
            var tabID = sender.tab.id;
            // call function as specfied by the request
            ER[request.method.parent][request.method.func](tabID, request.data, sendResponse);
            return true;
        }
    }
);