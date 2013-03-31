// Keep a reference to this window so it does not get collected on Android.
var messageWin;
function ApplicationTabGroup() {
	//create module instance
	var self = Ti.UI.createTabGroup(),
		TeamsWindow = require('ui/common/TeamsWindow');
	
	//create app tabs
	var teamsWin = new TeamsWindow(L('teams_win_title'));
	
	var controlsTab = Ti.UI.createTab({
		title: L('teams_win_title'),
		icon: '/images/tabs/KS_nav_views.png',
		window: teamsWin
	});
	teamsWin.containingTab = controlsTab;
	self.addTab(controlsTab);
	
	// Tabgroup events and message window
	messageWin = Titanium.UI.createWindow({
		height:30,
		width:250,
		bottom:70,
		borderRadius:10,
		touchEnabled:false,
		orientationModes : [
			Titanium.UI.PORTRAIT,
			Titanium.UI.UPSIDE_PORTRAIT,
			Titanium.UI.LANDSCAPE_LEFT,
			Titanium.UI.LANDSCAPE_RIGHT
		]
	});
	if (Ti.Platform.osname === 'iphone') {
		messageWin.orientationModes = [Ti.UI.PORTRAIT]
	}
	
	var messageView = Titanium.UI.createView({
		id:'messageview',
		height:30,
		width:250,
		borderRadius:10,
		backgroundColor:'#000',
		opacity:0.7,
		touchEnabled:false
	});
		
	var messageLabel = Titanium.UI.createLabel({
		id:'messagelabel',
		text:'',
		color:'#fff',
		width:250,
		height:'auto',
		font:{
			fontFamily:'Helvetica Neue',
			fontSize:13
		},
		textAlign:'center'
	});
	messageWin.add(messageView);
	messageWin.add(messageLabel);
	
	self.addEventListener('close', function(e) {
		if (e.source == self){
			if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
				self.open();
			}
		}
	});
	
	self.addEventListener('open',function(e) {
		if (e.source == self){
			Titanium.UI.setBackgroundColor('#fff');
			messageLabel.text = 'tab group open event';
			messageWin.open();
	
			setTimeout(function() {
				messageWin.close({opacity:0,duration:500});
			},1000);
		}
	});
	
	self.model = Ti.Platform.model;
	
	return self;
};

module.exports = ApplicationTabGroup;
