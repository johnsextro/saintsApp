function SchoolSelection() {
	var self = Ti.UI.createWindow({
		title : 'Choose School',
		backgroundColor : 'black'
	});
	
	SeasonSelection = require('schedule/SeasonSelection');
	var selectedSchool = '';
	
	self.layout = 'vertical'
	var instruction = Ti.UI.createLabel({
	  color: 'white',
	  text: 'Choose a School',
	  font:{fontSize:16},
	  width: 'auto', height: 'auto'
	});
	var url = "http://x8-avian-bricolage-r.appspot.com/school/SchoolService.school";
	// var url = "http://localhost:8080/school/SchoolService.school";
	var data = [];
	var json;
	
	var btnChooseSchool = Titanium.UI.createButton({
		title : 'OK'
	});
	var pckrSchool = Ti.UI.createPicker({
		top : 1
	});

	var xhr = Ti.Network.createHTTPClient({
    onload: function() {

		json = JSON.parse(this.responseText);
		if (json.schools != "") {
			for (i = 0; i < json.schools.length; i++) {
				school = json.schools[i];
				data.push(Ti.UI.createPickerRow({title: school.school, value: school.school, hasChild:false, test:''}));
			}	
		} else {
			data.push({title: "No Coaches Found", hasChild:false, test:''});
		}
		
		pckrSchool.add(data); 
		var body = Ti.UI.createView({layout:'vertical', backgroundColor:'black'});
		body.add(instruction);
		body.add(pckrSchool);
		body.add(btnChooseSchool);	
		self.add(body);
		pckrSchool.setSelectedRow(0,0,true);
    },
	onerror: function(e) {
		Ti.API.error("STATUS: " + this.status);
		Ti.API.error("TEXT:   " + this.responseText);
		Ti.API.error("ERROR:  " + e.error);
		alert('There was an error retrieving the remote data. Try again.');
	    },
	    timeout:5000
	});

	btnChooseSchool.addEventListener('click', function(e) {
		Ti.App.Properties.setString('School', selectedSchool);
		self.close();
		winSelectSeason = new SeasonSelection();
		winSelectSeason.open();
	});
		
	pckrSchool.selectionIndicator = true;
	pckrSchool.addEventListener('change', function(e) {
	    selectedSchool = e.row.value;
	});
	
	xhr.open("POST", url);
	xhr.setRequestHeader('Content-Type','application/json')
	xhr.send();
	
	pckrSchool.setSelectedRow(0,0,false);
	
	return self;
};

module.exports = SchoolSelection;
