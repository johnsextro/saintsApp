function schedule(_args) {
	var self = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'white'
	});
	
	// var url = "https://x8-avian-bricolage-r.appspot.com/schedule/ScheduleService.schedule";
	var url = "http://localhost:8080/schedule/ScheduleService.schedule";
	var data = []
	var json, schedule, fighters, games;
	
	var xhr = Ti.Network.createHTTPClient({
    onload: function() {
		json = JSON.parse(this.responseText);
		if (json.schedule != "") {
			json = JSON.parse(json.schedule);
			//replace this with a for loop to load all the games rather than just one.
			for (i = 0; i < json.games.length; i++) {
				game = json.games[i];
				data.push({title: game.game_date + ' vs. ' + game.opponent + ' at ' + game.location, hasChild:false, test:''});
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
    },
	onerror: function(e) {
		Ti.API.error("STATUS: " + this.status);
		Ti.API.error("TEXT:   " + this.responseText);
		Ti.API.error("ERROR:  " + e.error);
		alert('There was an error retrieving the remote data. Try again.');
	    },
	    timeout:5000
	});
	var params = '{"team_id": "1234"}';
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.send(params);
	return self;
}

module.exports = schedule;
