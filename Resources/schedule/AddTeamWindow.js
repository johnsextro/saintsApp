function AddTeamWindow() {
	var self = Ti.UI.createWindow({
		title:'Add Team',
		backgroundColor:'black'
	});

	self.layout = 'vertical'	
	TeamsWindow = require('ui/common/TeamsWindow');
	var instructions = Ti.UI.createLabel({
	  color: 'white',
	  text: 'Choose a Team to Add',
	  font:{fontSize:16},
	  width: 'auto', height: 'auto'
	});
	var url = "http://x8-avian-bricolage-r.appspot.com/coach/CoachService.coach";
	// var url = "http://localhost:8080/coach/CoachService.coach";
	var data = [];
	var json;
	var teamId, teamName;
	var btnAddTeam = Titanium.UI.createButton({
		title:'Add Team',
		right:'10',
		bottom: '10'
	});
	
	var btnCancel = Titanium.UI.createView({
		backgroundImage:'/images/icon_arrow_left.png',
		width: '40',
		height: '30',
		right: '10',
		left: '10'
	});
	var osname = Ti.Platform.osname;
	var pckrTeams = Ti.UI.createPicker({visibleItems: 8});
	pckrTeams.selectionIndicator = true;
	var row = 0;
	
	btnAddTeam.addEventListener('click', function(e) {
		var savedTeams = [];
		if (Ti.App.Properties.getList('Teams') != null) {
			savedTeams = Ti.App.Properties.getList('Teams');
		}
		savedTeams.push([teamId, teamName]);
		Ti.App.Properties.setList('Teams', savedTeams);
		self.close();
	});
	
	btnCancel.addEventListener('click', function(e) {
		self.close();
	});
	
	pckrTeams.addEventListener('change', function(e) {
	    teamId = e.row.value;
	    teamName = e.row.title;
	});
	
	
	var xhr = Ti.Network.createHTTPClient({
    onload: function() {

		json = JSON.parse(this.responseText);
		if (json.coaches != "") {
			for (i = 0; i < json.coaches.length; i++) {
				coach = json.coaches[i];
				data.push(Ti.UI.createPickerRow({title: coach.name + coach.grade, value: coach.team_id, hasChild:false, test:''}));
			}	
		} else {
			data.push({title: "No Coaches Found", hasChild:false, test:''});
		}
		
		pckrTeams.add(data); 
		pckrTeams.selectionIndicator = true;
		pckrTeams.setSelectedRow(0,0);	
		var body = Ti.UI.createView({height:'85%', layout:'vertical', backgroundColor:'black'});
		body.add(instructions);
		body.add(pckrTeams);	
		self.add(body);
		
		var footer = Ti.UI.createView({height:'15%', backgroundColor:'gray'});
		footer.add(btnAddTeam);
		footer.add(btnCancel);
		self.add(footer);
    },
	onerror: function(e) {
		Ti.API.error("STATUS: " + this.status);
		Ti.API.error("TEXT:   " + this.responseText);
		Ti.API.error("ERROR:  " + e.error);
		alert('There was an error retrieving the remote data. Try again.');
	    },
	    timeout:5000
	});
	var school = Ti.App.Properties.getString('School', '');
	var season = Ti.App.Properties.getString('Season', '');
	var params = '{"school": "' +school+ '", "season": "' +season+ '"}';
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.send(params);

	pckrTeams.setSelectedRow(0,0,false);
	return self;
};

module.exports = AddTeamWindow;