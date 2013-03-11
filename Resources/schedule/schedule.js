function schedule(_args) {
	var self = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'white'
	});
	
	var url = "https://x8-avian-bricolage-r.appspot.com/schedule/ScheduleService.schedule";
	var data, json;
	
	var xhr = Ti.Network.createHTTPClient({
    onload: function() {
		// Ti.API.debug(this.responseText);
	
		json = JSON.parse(this.responseText);
		Ti.API.info("Response: " + this.responseText);
		
		data = [
			{title: json.game_date + ' vs. ' + json.opponent + ' at ' + json.location, hasChild:false, test:''}
		];
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
