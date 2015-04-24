var ER = ER || {};

ER.utils = (function() {
    var _extID = chrome.i18n.getMessage('@@extension_id'); // chrome extension identifier

    return {
        extID: _extID
    };
})();

ER.messaging = (function() {
    var _extID = ER.utils.extID;

    /**
     * Sends a message to the background script
     *
     * @param {Object} message The message to send
     * @param {Function} callback Function to be called by the receiver
     */
    var _callBG = function(message, callback) {
        if (typeof callback !== 'undefined') {
            chrome.runtime.sendMessage(_extID, message, callback);
        } else {
            chrome.runtime.sendMessage(_extID, message);
        }
    };

    /**
     * Sends a message to a specific browsertab
     * @param {Integer} tabID Identifier of the tab, the message is to be sent to
     * @param {Object} msg The message to send
     * @param {Function} callback (optional) function to be called by the receiver
     */
    var _sendMsgTab = function(tabID, msg, callback) {
        if (typeof callback !== 'undefined') {
            chrome.tabs.sendMessage(tabID, msg, callback);
        } else {
            chrome.tabs.sendMessage(tabID, msg);
        }
    };

    /**
     * Sends a message to all tabs
     * @param {Object} msg The message to send
     * @param {Function} callback (optional) function to be called by the receivers
     */
    var _sendMsgAllTabs = function(msg, callback) {
        chrome.tabs.query({}, function(tabs) {
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (typeof callback !== 'undefined') {
                    chrome.tabs.sendMessage(tabs[i].id, msg, callback);
                } else {
                    chrome.tabs.sendMessage(tabs[i].id, msg);
                }
            }
        });
    };

    /**
     * Sends a message to all tabs, except a single one, specified by its identifier
     * @param {Integer} tabID Identifier of the tab to be excluded from the receivers
     * @param {Object} msg The message to send
     * @param {Function} callback (optional) function to be called by the receivers
     */
    var _sendMsgOtherTabs = function(tabID, msg, callback) {
        chrome.tabs.query({}, function(tabs) {
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (tabID !== tabs[i].id) {
                    if (typeof callback !== 'undefined') {
                        chrome.tabs.sendMessage(tabs[i].id, msg, callback);
                    } else {
                        chrome.tabs.sendMessage(tabs[i].id, msg);
                    }
                }
            }
        });
    };

    /**
     * Listens for incoming messages
     * @param {Function} callback a function that looks like this:
     function(any message, MessageSender sender, function sendResponse) {...};
     */
    var _listener = function(callback) {
        chrome.runtime.onMessage.addListener(callback);
    };

    return {
        sendMsgTab: _sendMsgTab,
        sendMsgAllTabs: _sendMsgAllTabs,
        sendMsgOtherTabs: _sendMsgOtherTabs,
        listener: _listener,
        callBG: _callBG
    };
})();
//
//ER.browserAction = (function() {
//    /**
//     * See https://developer.chrome.com/extensions/browserAction#event-onClicked for documentation
//     * @param {Function} callback
//     * @returns {undefined}
//     */
//    var _clickedListener = function(callback) {
//        chrome.browserAction.onClicked.addListener(callback);
//    };
//
//    /**
//     * See https://developer.chrome.com/extensions/browserAction#method-getBadgeText for documentation
//     * @param {Object} details
//     * @param {Function} callback
//     * @returns {undefined}
//     */
//    var _getBadgeText = function(details, callback) {
//        chrome.browserAction.getBadgeText(details, callback);
//    };
//
//    /**
//     * See https://developer.chrome.com/extensions/browserAction#method-setBadgeText for documentation
//     * @param {Object} details
//     * @returns {undefined}
//     */
//    var _setBadgeText = function(details) {
//        chrome.browserAction.setBadgeText(details);
//    };
//
//    return  {
//        clickedListener: _clickedListener,
//        getBadgeText: _getBadgeText,
//        setBadgeText: _setBadgeText
//    };
//})();
