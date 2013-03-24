function TeamsWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	// create table view data object
	var data = [
		{title:'5th Grade Basketball, Girls', hasChild:true, test:'schedule/schedule'}
	];
	
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
		win1 = AddTeam();
		win1.open();
	});
	self.rightNavButton = btnAddTeam;	
		
	return self;
};

function AddTeam() {
	var self = Ti.UI.createWindow({
		title:'Add Team',
		backgroundColor:'white'
	});

	var url = "http://localhost:8080/schedule/ScheduleService.schedule";
	var data = []
	var json, schedule, fighters, games;
	
	var xhr = Ti.Network.createHTTPClient({
    onload: function() {

		json = JSON.parse(this.responseText);
		if (json.schedule != "") {
			json = JSON.parse(json.schedule);
			//replace this with a for loop to load all the games rather than just one.
			//{"games": [{"game_date": "Sat, 01/05/2013", "time": "1:00 PM", "home": "St_Cletus-Schultehenrich (O)", "away": "SJC-Edmunds (C)", "location": "St_Cletus"}]}
			for (i = 0; i < json.games.length; i++) {
				game = json.games[i];
				data.push({title: game.game_date + ' ' + game.time + ' at ' + game.location, hasChild:false, test:''});
				// ' ' + game.home + ' vs. ' + game.away +
			}	
		} else {
			data.push({title: "No Games Found", hasChild:false, test:''});
		}
		
		// create table view
		for (var i = 0; i < data.length; i++ ) { data[i].color = '#000'; data[i].font = {fontWeight:'bold'} };
		var tableview = Titanium.UI.createTableView({
			data:data
		});
	
		// add table view to the window
		self.add(tableview);
		// spinner.hide();
    },
	onerror: function(e) {
		Ti.API.error("STATUS: " + this.status);
		Ti.API.error("TEXT:   " + this.responseText);
		Ti.API.error("ERROR:  " + e.error);
		alert('There was an error retrieving the remote data. Try again.');
	    },
	    timeout:5000
	});
	
	var label1 = Ti.UI.createLabel({
	  color: '#900',
	  font: { fontSize:48 },
	  shadowColor: '#aaa',
	  shadowOffset: {x:5, y:5},
	  text: 'A simple label',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  top: 30,
	  width: 'auto', height: 'auto'
	});
		
	self.add(label1);
	// var params = '{"team_id": "5766"}';
	// xhr.open("POST", url);
	// xhr.setRequestHeader('Content-Type','application/json')
	// xhr.send(params);
	return self;
};

module.exports = TeamsWindow;
