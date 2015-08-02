$(document).ready(function () {

  function getQueryVariable(variable) {
    var query = window.location.href;
    var vars = query.split('&');
    for (var i = vars.length-1; i > 0 ; i--) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }


  var rtime;
  var timeout = false;
  var delta = 2000;
  var ignore = false;
  function listenForChanges(state){
    if(state == "on") {
      $("body").bind("DOMSubtreeModified", function(e) {
        // console.log("change!");
        rtime = Date.now();
        if (timeout === false) {
            timeout = true;
            setTimeout(domChanged, delta);
        }
      });
    } else if (state == "off") {
      $("body").unbind("DOMSubtreeModified");
    }
  }

  listenForChanges("on");

  function domChanged(){
     if (Date.now() - rtime < delta) {
        setTimeout(domChanged, delta);
    } else {
        timeout = false;
        console.log('Done change! '+getQueryVariable('q'));
        search();
    }
  }

  function search() {
    var keyword = getQueryVariable('q');
    var endpoint = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAo3PI6w8mDmWI8ydqURsOexKTtt8Fv3po&cx=016998496671277856577:ru2znyqf8rs&q=' + keyword;
    $.ajax({
    url: endpoint,
    type: 'GET',
    cache: true
    }).done(function (data) {
      console.log(data);
      if(data.items)
        processResults(data.items);
    });
  }

  function processResults(items){
    listenForChanges("off");;
    for (var i = 0; i < items.length; i++) {
      addResultToPage(items[i].title, items[i].link, items[i].snippet);
    }
    setTimeout(listenForChanges("on"), 1000);
  }

  function addResultToPage(title, url, description) {
    $("#ires .srg").prepend("<div><a href=" + url + ">" + title +"</a></div>");
    // console.log(title)
  }


});
