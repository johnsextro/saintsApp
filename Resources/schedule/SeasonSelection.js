function SeasonSelection() {
	var self = Ti.UI.createWindow({
		title : 'Choose A Season',
		backgroundColor : 'black'
	});
	var osname = Ti.Platform.osname;
	var selectedSeason = '';
	SchoolSelection = require('schedule/SchoolSelection');
	
	
	self.layout = 'vertical'
	var btnChooseSeason = Titanium.UI.createButton({
		title : 'OK'
	});
	var pckrSeason = Ti.UI.createPicker({
		top : 1
	});
	var instructions = Ti.UI.createLabel({
	  color: 'white',
	  text: 'Choose the Season',
	  font:{fontSize:16},
	  width: 'auto', height: 'auto'
	});
	
	var url = "http://x8-avian-bricolage-r.appspot.com/season/SeasonService.season";
	// var url = "http://localhost:8080/school/SchoolService.school";
	var data = [];
	var json;
	
	var xhr = Ti.Network.createHTTPClient({
    onload: function() {

		json = JSON.parse(this.responseText);
		if (json.seasons != "") {
			for (i = 0; i < json.seasons.length; i++) {
				season = json.seasons[i];
				data.push(Ti.UI.createPickerRow({title: season.season, value: season.season, hasChild:false, test:''}));
			}	
		} else {
			data.push({title: "No Seasons Found", hasChild:false, test:''});
		}
		
		pckrSeason.add(data); 
		var body = Ti.UI.createView({layout:'vertical', backgroundColor:'black'});
		body.add(instructions);
		body.add(pckrSeason);
		body.add(btnChooseSeason);	
		self.add(body);
		pckrSeason.setSelectedRow(0,0,true);
    },
	onerror: function(e) {
		Ti.API.error("STATUS: " + this.status);
		Ti.API.error("TEXT:   " + this.responseText);
		Ti.API.error("ERROR:  " + e.error);
		alert('There was an error retrieving the remote data. Try again.');
	    },
	    timeout:5000
	});
	
	pckrSeason.setSelectedRow(0,0,true);
	btnChooseSeason.addEventListener('click', function(e) {
		Ti.App.Properties.setString('Season', selectedSeason);
		schoolSelection = new SchoolSelection();
		self.close();
		schoolSelection.open();
	});
		
	pckrSeason.selectionIndicator = true;
	pckrSeason.addEventListener('change', function(e) {
	    selectedSeason = e.row.value;
	});

	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.send();

	pckrSeason.setSelectedRow(0,0,false);
	
	return self;
};

module.exports = SeasonSelection;
