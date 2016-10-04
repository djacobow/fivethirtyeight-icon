var last_data = {};

var default_cfg = {
  'colors' : [
    [ 0.8, [   0, 200,   0, 255 ] ],
    [ 0.5, [ 200, 200,   0, 255 ] ],
    [ 0.0, [ 200,   0,   0, 255 ] ],
  ],
  'model': 'plus',
  'candidate': 'D',
  'timeout': 15 * 60 * 1000,
};

var cfg = {};


function config_is_complete(c) {
 var must = ['colors','model','candidate','timeout'];
 for (var i in must) {
  if (!(must[i] in c)) return false;
 }
 return true;
}

function load_config(cb) {                                                  
  var source = null;                                                            
  chrome.storage.local.get(['config'],function(items) {                  
    if (('config' in items) && config_is_complete(items['config'])) {
      cfg = items.config;                                             
      cb(cfg);                                                               
    } else {                                                                    
      cfg = default_cfg;
      chrome.storage.local.set({'config': cfg},function() {           
        cb(cfg);                                                             
      });                                                                       
    }                                                                           
  });                                                                           
};                                                                              
      

function whoops(e) {
  chrome.browserAction.setIcon({'path': 'question.png'});
  chrome.browserAction.setBadgeText({ 'text': ''});
};

chrome.runtime.onMessage.addListener(
  function(request, sender, resp_cb) {
    console.log("onMessage");
    if (request.message == 'update_popup') {
      resp_cb({'message': 'OK', 'data': last_data });
    } else if (request.message == 'check_now') {
      cfg = request.new_cfg;  
      checkNS();
      resp_cb({'message': 'OK'});
    } else {
      resp_cb({'message': 'not_for_me'});
    }
  }  
);

function makeColor(value) {
  for (var i in cfg['colors']) {
    var item = cfg['colors'][i]; 
    if (value >= item[0]) return item[1];
  }
  return [0,0,0,0];
}

function handle_load_data() {
  if (this.status === 200) {
    var re = /race\.stateData\s=\s(.*);\s*race\.pathPrefix/;
    var match = re.exec(this.responseText);
    if (match != null) {
      var js_str = match[1];
      var data = JSON.parse(js_str);
      last_data = data;
      var model = cfg['model'];
      var candidate = cfg['candidate'];
      var hrc_perc = data['latest'][candidate]['models'][model]['winprob'];
      chrome.browserAction.setBadgeBackgroundColor({'color': makeColor(hrc_perc/100)});
      chrome.browserAction.setBadgeText({'text': Math.round(hrc_perc).toString()});
      var icon = (candidate == 'R') ? 'djt-38.png' : 'hrc-38.png';
      chrome.browserAction.setIcon({'path': icon});
      
    } else {
      console.log("boo");
    }
    return;
  };
  whoops(); // never get here in successful case
}

function checkNS() {
 try {
   var xhr = new XMLHttpRequest();
   xhr.addEventListener('load',handle_load_data);
   xhr.addEventListener('abort',whoops);
   xhr.addEventListener('error',whoops);
   xhr.open('GET','https://projects.fivethirtyeight.com/2016-election-forecast');
   xhr.send();
 } catch(e) {
   whoops();
 };
}

function forever() {
  load_config(checkNS);
  setTimeout(forever, cfg['timeout']);
}

forever();
