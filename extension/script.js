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
  var query;

  vars.forEach(function(v){
    var pair = v.split('=');
    if (decodeURIComponent(pair[0]) == 'q') {
      query = decodeURIComponent(pair[1]);
    }
  });

  return query;
}

function search(url) {
  var endpoint = buildUrl('https://www.googleapis.com/customsearch/v1',{
    key: 'AIzaSyD_MTFPdH4HhtQD67-zyaGspKUOD0GQ6V0',
    cx: '016998496671277856577:ru2znyqf8rs',
    q: getQueryVariable(url)
  });

  console.log(endpoint);

  get(endpoint, processResults);
}

function buildUrl(basePath, variables){
  var url = basePath + "?";
  for(var key in variables){
    url += key + "=" + variables[key] + "&";
  }

  return url.slice(0,-1);
}

function processResults(response){
  if(!response.items) return;

  var html = buildFragment(response.items);
  element("#center_col").insertBefore(html,element("#res"));
}

function buildFragment(items){
  var fragment = document.createDocumentFragment();

  items.forEach(function(item){
    fragment.appendChild(buildItem(item.title, item.link, item.snippet));
  });

  return fragment;
}

function buildItem(title, url, description){
  var div = document.createElement("div");
  div.innerHTML = "<a href='" + url + "'>" + title +"</a>";

  return div;
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
    var responseObject = JSON.parse(xhr.responseText);
    callback(responseObject, xhr.statusCode);
  };
}

function element(selector){
  var result = document.querySelectorAll(selector);
  return (result.length === 1) ? result[0] : result;
}
