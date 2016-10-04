
function populate() {
  chrome.storage.local.get(['config'],function(items) {                  
    if ('config' in items) {
      var os = JSON.stringify(items['config'], null, 2);
      document.getElementById('json').value = os;
    }
  });                                                                           
};                                                                              

function save(cfg, cb) {
 chrome.storage.local.set({'config': cfg},function() {
  chrome.runtime.sendMessage({'message': 'check_now', 'new_cfg': cfg},function cb(resp) {
   populate();
   return true;
   if (cb !== null) cb();
  });
 })
}

function save_from_textarea() {
 var is = document.getElementById('json').value;
 try {
   new_cfg = JSON.parse(is);
   if (new_cfg !== undefined) {
     save(new_cfg, function() { populate(); });
   }
 } catch(e) {
 }
}

function mutate(key, value) {
  chrome.storage.local.get(['config'],function(items) {                  
    if ('config' in items) {
      var cfg = items['config'];
      cfg[key] = value;
      save(cfg,function() { });
    }
  });                                                                           
};                                                                              

function setup_callbacks() {
 document.getElementById('save').onclick = save_from_textarea;

 document.getElementById('polls').onclick = function() {
  mutate('model','polls');
 };
 document.getElementById('plus').onclick = function() {
  mutate('model','plus');
 };
 document.getElementById('now').onclick = function() {
  mutate('model','now');
 };
 document.getElementById('hrc').onclick = function() {
  mutate('candidate','D');
 };
 document.getElementById('djt').onclick = function() {
  mutate('candidate','R');
 };
};


setup_callbacks();
populate();
