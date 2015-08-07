// intercept ajax open method
var open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async) {
  if(url.indexOf('/search?') === 0) {
    search(url);
  }
  open.call(this, method, url, true);
};

function getQueryVariable(url) {
  var vars = url.split('&');
  var pair;

  for (var i = vars.length-1; i > 0 ; i--) {
    pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == 'q') {
      return decodeURIComponent(pair[1]);
    }
  }
}

function search(url) {
  var endpoint = buildUrl('https://www.googleapis.com/customsearch/v1',{
    key: 'AIzaSyD_MTFPdH4HhtQD67-zyaGspKUOD0GQ6V0',
    cx: '016998496671277856577:ru2znyqf8rs',
    q: getQueryVariable(url)
  });

  get(endpoint, function (response) {
    if(response.items) {
      processResults(response.items);
    }
  });
}

function buildUrl(basePath, variables){
  var url = basePath + "?";
  for(var key in variables){
    url += key + "=" + variables[key] + "&";
  }

  return url;
}

function get(url, data, callback){
  if(typeof data === "function") {
    callback = data;
    data = {};
  }

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.send(JSON.stringify(data));
  xhr.onreadystatechange = function() {
    callback(xhr.responseText, xhr.statusCode);
  };
}

function processResults(items){
  for (var i = 0; i < items.length; i++) {
    addResultToPage(items[i].title, items[i].link, items[i].snippet);
  }
}

function addResultToPage(title, url, description) {
  $("#ires .srg").prepend("<div><a href=" + url + ">" + title +"</a></div>");
  // console.log(title)
}
