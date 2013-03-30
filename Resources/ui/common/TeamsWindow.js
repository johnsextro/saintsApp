function TeamsWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	AddTeamWindow = require('schedule/AddTeamWindow');
	var teams = Ti.App.Properties.getList('Teams'); 
	
	// create table view data object
	var data = [];
	for (var teamIndex = 0; teamIndex < teams.length; teamIndex++) {
		data.push({title: teams[teamIndex][1], value: teams[teamIndex][0], hasChild:true, test:'schedule/schedule'});
		// data.push({title:'abc', value:'1234', hasChild:true, test:'schedule/schedule'});
	};
		
	// create table view
	for (var i = 0; i < data.length; i++ ) { data[i].color = '#000'; data[i].font = {fontWeight:'bold'} };
	var tableview = Titanium.UI.createTableView({
		data:data
	});
	
	// create table view event listener
	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({
					title:e.rowData.title,
					team_id: e.rowData.value,
					containingTab:self.containingTab,
					tabGroup:self.tabGroup
				});
			self.containingTab.open(win,{animated:true});
		}
	});
	
	// add table view to the window
	self.add(tableview);
	
	var btnAddTeam = Titanium.UI.createButton({title:'Add'});
	btnAddTeam.addEventListener('click', function(e) {
		winAddTeam = new AddTeamWindow();
		winAddTeam.open();
	});
	
	self.rightNavButton = btnAddTeam;	

	return self;
};
module.exports = TeamsWindow;
