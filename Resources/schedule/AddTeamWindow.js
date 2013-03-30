function AddTeamWindow() {
	var self = Ti.UI.createWindow({
		title:'Add Team',
		backgroundColor:'black'
	});
	
	TeamsWindow = require('ui/common/TeamsWindow');
	
	var url = "http://x8-avian-bricolage-r.appspot.com/coach/CoachService.coach";
	var data = [];
	var json;
	var btnAddTeam = Titanium.UI.createButton({
		title:'Add Team',
		height:40,
		width:200
	});
	
	var pckrTeams = Ti.UI.createPicker();
	var row = 0;
	
	btnAddTeam.addEventListener('click', function(e) {
		var selected = pckrTeams.getSelectedRow(row);
		Ti.API.info(selected.title);
		Ti.API.info(selected.value);
		var savedTeams = Ti.App.Properties.getList('Teams');
		savedTeams.push([selected.value, selected.title]);
		Ti.App.Properties.setList('Teams', savedTeams);
		self.close();
	});
	
	pckrTeams.addEventListener('change', function(e) {
	    row = e.selectedValue[0];
	});
	
	
	var xhr = Ti.Network.createHTTPClient({
    onload: function() {

		json = JSON.parse(this.responseText);
		if (json.coaches != "") {
			
			//replace this with a for loop to load all the games rather than just one.
			//{"games": [{"game_date": "Sat, 01/05/2013", "time": "1:00 PM", "home": "St_Cletus-Schultehenrich (O)", "away": "SJC-Edmunds (C)", "location": "St_Cletus"}]}
			for (i = 0; i < json.coaches.length; i++) {
				coach = json.coaches[i];
				data.push({title: coach.name, value: coach.team_id, hasChild:false, test:''});
			}	
		} else {
			data.push({title: "No Coaches Found", hasChild:false, test:''});
		}
		
		// add table view to the window
		
		pckrTeams.add(data); 
		pckrTeams.selectionIndicator = true;
		self.add(label1);
		self.add(pckrTeams);
		pckrTeams.setSelectedRow(0,1,true);
		btnAddTeam.setTop(400);
		self.add(btnAddTeam);			
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
	  color: 'white',
	  text: 'Choose a Team to Add',
	  font:{fontSize:14},
	  top: 10,
	  width: 'auto', height: 'auto'
	});
	

	var params = '{"school": "SJC"}';
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.send(params);
	return self;
};

module.exports = AddTeamWindow;