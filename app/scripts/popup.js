(function() {
  'use strict';

  function addClass (el, className) {
    if (el.className.indexOf(className) > -1) {
      return;
    }
    else {
      el.className += (' ' + className);
    }
  }

  function removeClass(el, className) {
    el.className = el.className.replace(className, '');
  }

  document.body.onload = function() {
    var hlTabs = [];
    var tabList = document.getElementById('tablist');
    var status = document.getElementById('status');
    status.innerHTML = 'Press Ctrl + C to copy & close.';
    status.style.color = '#696969';
    var timerIds = [];
    var CLOSE_TIME_OUT = 1600;
    var CLOSE_INTERVAL = CLOSE_TIME_OUT / 4;

    function clearTimers() {
      timerIds.forEach(function(id) {
        clearInterval(id);
      });
    }

    tabList.oncopy = function() {
      clearTimers();
      var t = CLOSE_TIME_OUT;
      status.style.color = '#17F100';
      status.innerHTML = 'Links copied. Closing';
      timerIds.push(setInterval(function() {
        t -= CLOSE_INTERVAL;
        status.innerHTML = '. ' + status.innerHTML + ' .';
        if (t < 0) {
          window.close();
        }
      }, CLOSE_INTERVAL));
    };

    document.body.onclick = function() {
      status.innerHTML = 'Press Ctrl + C to copy & close.';
      status.style.color = '#696969';
      clearTimers();
    };

    chrome.tabs.query({
      currentWindow: true
    }, function(tabs) {
      var i;
      for (i = 0; i < tabs.length; i++) {
        if (tabs[i].highlighted) {
          hlTabs.push(tabs[i]);
        }
      }

      console.log(hlTabs);
      for (i = 0; i < hlTabs.length; i++) {
        tabList.innerHTML += ('<p class="links">' + hlTabs[i].url + '</p>');
      }

      var range = document.createRange();
      range.selectNode(tabList);
      window.getSelection().addRange(range);
    });

    var tabBtnGet = document.getElementById('tabBtnGet');
    var tabBtnOpen = document.getElementById('tabBtnOpen');

    var tabGet = document.getElementById('tabGet');
    var tabOpen = document.getElementById('tabOpen');

    tabBtnGet.onclick = function() {
      removeClass(tabOpen, 'tab-content-active');
      removeClass(tabBtnOpen, 'tab-btn-active');
      addClass(tabGet, 'tab-content-active');
      addClass(tabBtnGet, 'tab-btn-active');
    };

    tabBtnOpen.onclick = function() {
      addClass(tabOpen, 'tab-content-active');
      addClass(tabBtnOpen, 'tab-btn-active');
      removeClass(tabGet, 'tab-content-active');
      removeClass(tabBtnGet, 'tab-btn-active');
    };

    var tabInput = document.getElementById('tabInput');
    var tabFoundList = document.getElementById('tabFoundList');
    var tabFound = [];

    tabInput.onkeyup = function() {
      console.log(tabInput.value);
      // var matches = tabInput.value.match(/(?i)\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/);
      // var matches = tabInput.value.match(/(?i)\b((?:[a-z][\w-]+:(?:/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/);
      // var matches = tabInput.value.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
      tabFound = tabInput.value.match(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g);
      // console.log(matches);
      tabFoundList.innerHTML = '';
      if (tabFound) {
        tabFound.forEach(function(link) {
          console.log(link);
          tabFoundList.innerHTML += ('<p class="link" title="' + link + '">' + link + '</p>');
        });
      }
    };

    var btnOpen = document.getElementById('btnOpen');
    btnOpen.onclick = function() {
      tabFound.forEach(function(link) {
        chrome.tabs.create({
          url: link
        });
      });
    };
  };
})();
