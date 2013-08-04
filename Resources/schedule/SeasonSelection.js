function SeasonSelection() {
	var self = Ti.UI.createWindow({
		title : 'Choose A Season',
		backgroundColor : 'black'
	});
	var osname = Ti.Platform.osname;
	var selectedSeason = '';
	AddTeamWindow = require('schedule/AddTeamWindow');
	
	self.layout = 'vertical'
	var btnChooseSeason = Titanium.UI.createButton({
		title : 'OK'
	});
	var pckrSeason = Ti.UI.createPicker({
		top : 1
	});
	var instruction = Ti.UI.createLabel({
	  color: 'white',
	  text: 'Choose the Season',
	  font:{fontSize:16},
	  width: 'auto', height: 'auto'
	});
	
	var seasons = [];
	seasons.push(Ti.UI.createPickerRow({
		title : 'Baseball/Softball 2013',
		value : '2013 St. Charles CYC Baseball/Softball'
	}));
	seasons.push(Ti.UI.createPickerRow({
		title : 'Soccer 2013',
		value : '2013 St. Charles CYC Soccer'
	}));
	seasons.push(Ti.UI.createPickerRow({
		title : 'Volleyball 2013',
		value : '2013 St. Charles CYC Volleyball'
	}));
	
	var body = Ti.UI.createView({layout:'vertical', backgroundColor:'black'});
	body.add(instruction);
	pckrSeason.add(seasons);
	body.add(pckrSeason);
	body.add(btnChooseSeason);
	self.add(body);


	pckrSeason.setSelectedRow(0,0,true);
	btnChooseSeason.addEventListener('click', function(e) {
		Ti.App.Properties.setString('Season', selectedSeason);
		winAddTeam = new AddTeamWindow();
		self.close();
		winAddTeam.open();
	});
		
	pckrSeason.selectionIndicator = true;
	pckrSeason.addEventListener('change', function(e) {
	    selectedSeason = e.row.value;
	});
	pckrSeason.setSelectedRow(0,0,false);
	
	return self;
};

module.exports = SeasonSelection;
