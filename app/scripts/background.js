'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});


function updateBadge() {
  var hlTabs = [];
  chrome.tabs.query({
    currentWindow: true
  }, function(tabs) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].highlighted) {
        hlTabs.push(tabs[i]);
      }
    }

    console.log(hlTabs, hlTabs.length);
    chrome.browserAction.setBadgeText({text: hlTabs.length + ''});

    var range = document.createRange();
    range.selectNode(document.getElementById('tablist'));
    window.getSelection().addRange(range);
  });
}

chrome.browserAction.setBadgeBackgroundColor({
  color: '#4656A6'
});

chrome.tabs.onHighlightChanged.addListener(updateBadge);
updateBadge();
