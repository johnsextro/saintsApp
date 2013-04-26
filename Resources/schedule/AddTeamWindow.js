function AddTeamWindow() {
	var self = Ti.UI.createWindow({
		title:'Add Team',
		backgroundColor:'black'
	});

	self.layout = 'vertical'	
	TeamsWindow = require('ui/common/TeamsWindow');
	var label1 = Ti.UI.createLabel({
	  color: 'black',
	  text: 'Choose a Team to Add',
	  font:{fontSize:16},
	  width: 'auto', height: 'auto'
	});
	var url = "http://x8-avian-bricolage-r.appspot.com/coach/CoachService.coach";
	var data = [];
	var json;
	var btnAddTeam = Titanium.UI.createButton({
		title:'Add Team',
		left:'5%'
	});
	var btnCancel = Titanium.UI.createButton({
		title:'Cancel',
		left:'20%'
	});
	
	var pckrTeams = Ti.UI.createPicker({visibleItems: 8});
	pckrTeams.selectionIndicator = true;
	var row = 0;
	

	
	btnAddTeam.addEventListener('click', function(e) {
		Ti.API.info("" + row);
		// var selected = pckrTeams.getSelectedRow(row);
		var selected = data[row];
		Ti.API.info(selected.title);
		Ti.API.info(selected.value);
		var savedTeams = [];
		if (Ti.App.Properties.getList('Teams') != null) {
			savedTeams = Ti.App.Properties.getList('Teams');
		}
		savedTeams.push([selected.value, selected.title]);
		Ti.App.Properties.setList('Teams', savedTeams);
		self.close();
	});
	
	btnCancel.addEventListener('click', function(e) {
		self.close();
	});
	
	pckrTeams.addEventListener('change', function(e) {
		Ti.API.info("selected value " + e.rowIndex);
	    row = e.rowIndex;
	});
	
	
	var xhr = Ti.Network.createHTTPClient({
    onload: function() {

		json = JSON.parse(this.responseText);
		if (json.coaches != "") {
			Ti.API.info("Found coaches in response");
			//replace this with a for loop to load all the games rather than just one.
			//{"games": [{"game_date": "Sat, 01/05/2013", "time": "1:00 PM", "home": "St_Cletus-Schultehenrich (O)", "away": "SJC-Edmunds (C)", "location": "St_Cletus"}]}
			for (i = 0; i < json.coaches.length; i++) {
				coach = json.coaches[i];
				Ti.API.info("Adding coach " + coach.name);
				data.push(Ti.UI.createPickerRow({title: coach.name, value: coach.team_id, hasChild:false, test:''}));
			}	
		} else {
			data.push({title: "No Coaches Found", hasChild:false, test:''});
		}
		
		pckrTeams.add(data); 
		pckrTeams.selectionIndicator = true;
		pckrTeams.setSelectedRow(0,0);	
		var body = Ti.UI.createView({height:'85%', layout:'vertical', backgroundColor:'#fff'});
		body.add(label1);
		body.add(pckrTeams);	
		self.add(body);
		
		var footer = Ti.UI.createView({height:'15%', layout:'horizontal', backgroundColor:'silver'});
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
	
	var params = '{"school": "SJ"}';
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.send(params);

	return self;
};

module.exports = AddTeamWindow;