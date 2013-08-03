function SeasonSelection() {
	var self = Ti.UI.createWindow({
		title : 'Choose A Season',
		backgroundColor : 'black'
	});
	var selectedSeason = '';
	AddTeamWindow = require('schedule/AddTeamWindow');
	
	self.layout = 'vertical'
	var btnChooseSeason = Titanium.UI.createButton({
		title : 'OK',
		top : 200
	});
	var pckrSeason = Ti.UI.createPicker({
		top : 1
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
	pckrSeason.add(seasons);
	self.add(pckrSeason);
	self.add(btnChooseSeason);


	pckrSeason.setSelectedRow(0,0,true);
	btnChooseSeason.addEventListener('click', function(e) {
		Ti.App.Properties.setString('Season', selectedSeason);
		self.close();
		winAddTeam = new AddTeamWindow();
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
