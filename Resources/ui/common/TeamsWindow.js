function TeamsWindow(title) {
	var self = Ti.UI.createWindow({
		title : title,
		backgroundColor : 'white'
	});
	var osname = Ti.Platform.osname

	self.layout = 'vertical'
	SchoolSelection = require('schedule/SchoolSelection');


	var header = Ti.UI.createView({
		height : '10%',
		backgroundColor : 'silver'
	});
	var btnAddTeam = Titanium.UI.createButton({
		title : 'Add',
		right : '5%',
		style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	btnAddTeam.addEventListener('click', function(e) {
		schoolSelection = new SchoolSelection();
		schoolSelection.open();
	});

	header.add(btnAddTeam);
	self.add(header);

	var body = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		backgroundColor : '#fff'
	});
	var tableview = Titanium.UI.createTableView();
	body.add(tableview);

	self.add(body);

	self.addEventListener('focus', function(e) {
		var teams = [];
		Ti.API.info("trying to load local teams");
		if (Ti.App.Properties.getList('Teams') != null) {
			teams = Ti.App.Properties.getList('Teams');
		}
		// create table view data object
		var data = [];
		for (var teamIndex = 0; teamIndex < teams.length; teamIndex++) {
			data.push({
				title : teams[teamIndex][1],
				value : teams[teamIndex][0],
				hasChild : true,
				test : 'schedule/schedule'
			});
			// data.push({title:'abc', value:'1234', hasChild:true, test:'schedule/schedule'});
		};

		// create table view
		for (var i = 0; i < data.length; i++) {
			data[i].color = '#000';
			data[i].font = {
				fontWeight : 'bold'
			}
		};
		tableview.setData(data);
	});

	// create table view event listener
	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test), win = new ExampleWindow({
				title : e.rowData.title,
				team_id : e.rowData.value,
				containingTab : self.containingTab,
				tabGroup : self.tabGroup
			});
			self.containingTab.open(win, {
				animated : true
			});
		}
	});

	tableview.addEventListener('swipe', function(e) {
		if (osname === 'iphone' || osname === 'ipad') {
			e.source.setEditable(true);
		} else {
			self.add(Titanium.UI.createButton({
				title : 'Delete',
				style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
				top : 5,
				width : 300,
				height : 30
			}));
		}
	});

	if (osname === 'iphone' || osname === 'ipad') {
		tableview.addEventListener('delete', function(e) {
			var props = Ti.App.Properties.getList('Teams');
			props.splice(e.index, 1);
			Ti.App.Properties.setList('Teams', props);
		});
	}
	return self;
};
module.exports = TeamsWindow;
