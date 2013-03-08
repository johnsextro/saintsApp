function schedule(_args) {
	var self = Ti.UI.createWindow({
		title:_args.title,
		backgroundColor:'white'
	});
	
	var data = [
		{title:'3/13/2013 vs. J & A at 1:00pm', hasChild:false, test:''},
		{title:'3/20/2013 vs. SESR at 3:00pm', hasChild:false, test:''},
		{title:'3/27/2013 vs. Westgate at 2:00pm', hasChild:false, test:''}
	];
	
	// create table view
	for (var i = 0; i < data.length; i++ ) { data[i].color = '#000'; data[i].font = {fontWeight:'bold'} };
	var tableview = Titanium.UI.createTableView({
		data:data
	});

	// add table view to the window
	self.add(tableview);
	return self;
}

module.exports = schedule;
