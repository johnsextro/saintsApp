function SchoolSelection() {
	var self = Ti.UI.createWindow({
		title : 'Choose School',
		backgroundColor : 'black'
	});
	var selectedSchool = '';
	
	self.layout = 'vertical'
	var btnChooseSchool = Titanium.UI.createButton({
		title : 'OK',
		top : 220
	});
	var pckrSchool = Ti.UI.createPicker({
		top : 1
	});

	var schools = [];
	schools.push(Ti.UI.createPickerRow({
		title : 'St. Joseph',
		value : 'SJ'
	}));
	schools.push(Ti.UI.createPickerRow({
		title : 'Immaculate Conception, Dardenne',
		value : 'ICD'
	}));
	schools.push(Ti.UI.createPickerRow({
		title : 'St. Elizabeth',
		value : 'SESR'
	}));
	schools.push(Ti.UI.createPickerRow({
		title : 'Holy Spirit',
		value : 'HS'
	}));
	schools.push(Ti.UI.createPickerRow({
		title : 'Sts. Joachim and Ann',
		value : 'SJ'
	}));
	schools.push(Ti.UI.createPickerRow({
		title : 'Academy of the Sacred Heart',
		value : 'AS'
	}));
	pckrSchool.add(schools);
	self.add(pckrSchool);
	self.add(btnChooseSchool);


	pckrSchool.setSelectedRow(0,0,true);
	btnChooseSchool.addEventListener('click', function(e) {
		Ti.API.info(selectedSchool);
		Ti.App.Properties.setString('School', selectedSchool);
		self.close();
	});
		
	pckrSchool.selectionIndicator = true;
	pckrSchool.addEventListener('change', function(e) {
	    Ti.API.info("You selected row: "+e.row.value);
	    selectedSchool = e.row.value;
	});
	pckrSchool.setSelectedRow(0,0,false);
	
	return self;
};

module.exports = SchoolSelection;
