function percentify(val) {
    var rounded = Math.round(val*10);
    var tens   = Math.floor(rounded / 100).toString();
    if (tens == '0') tens = ' ';
    rounded -= tens * 100;
    var ones   = Math.floor(rounded /  10);
    rounded -= ones * 10;
    var tenths = Math.floor(rounded /   1);
    // return Math.round(val*10)/10).toString() + '%';
    return tens.toString() + 
           ones.toString() + 
           '.' +
           tenths.toString() +
           '%';
};

function createTable(d,where) {
      
      models = {
        'polls': 'Polls Only',
        'plus' : 'Polls Plus',
        'now'  : 'Nowcast',
      };
      candidates = {
        'D': 'Hillary Clinton',
        'R': 'Donald Trump',
        'L': 'Gary Johnson',
      }

      var div = document.createElement('div');
      console.log(d);
      var date = d['latest']['D']['date'];
      var t = document.createElement('table');
      div.appendChild(t);

      var rc = 0;
      var cc = 0;

      var row = t.insertRow(rc++);
      var cell = row.insertCell(cc++);
      cell.colSpan = 1 + Object.keys(models).length;
      cell.innerHTML = 'Probability of Winning as of ' + date + '<br><br>';
      cell.className = 'headingcell';
      cc = 0; 

      row = t.insertRow(rc++);
      cell = row.insertCell(cc++);
      cell.innerHTML = '';
      for (var model in models) {
        cell = row.insertCell(cc++);
        cell.innerHTML = models[model];
        cell.className = 'boldcell';
      }

      for (var party in candidates) {
        row = t.insertRow(rc++);
        cc = 0;
        var cell = row.insertCell(cc++);
        cell.innerHTML = candidates[party];
        cell.className = 'boldcell';
        for (var model in models) {
          var cell = row.insertCell(cc++);
          var val = d['latest'][party]['models'][model]['winprob'];
          cell.className = 'numbercell';
          cell.innerHTML = percentify(val);
        }
      }

      document.getElementById(where).appendChild(div);
};

function askToBePopulated() {
  chrome.runtime.sendMessage({'message': 'update_popup'},function cb(resp) {
    if (resp.message == 'OK') {
      var d = resp.data;
      if (d !== undefined) createTable(d,'topdiv');
    }
    return true;
  });
};


askToBePopulated();

