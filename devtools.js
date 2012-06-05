// Most of the logic happens in devtools.html since it loads right away
var projectState = {};
var inspectedLocation;

var loadProject = function(type, path){
	checkResources();
	registerNavListener();
	backgroundMsgSupport.watchDirectory(path, function(){});
	
	projectState = {type: type, path: path};
	if (type != 'fileUrl'){
		localStorage[inspectedLocation.origin] = JSON.stringify(projectState);
	}
};

var checkLocation = function(){
	chrome.devtools.inspectedWindow.eval('this.location', function(location, isException){
		if (inspectedLocation && location.origin === inspectedLocation.origin){
			return;
		}
		inspectedLocation = location;
		// file protocol is a special case
		var type,path;
		if (location.protocol == 'file:'){
			var pathElements = location.pathname.split("/");
			type = 'fileUrl';
			path = '';
			for (var i = 1; i < pathElements.length - 1; i++){
				path = path + '/' + pathElements[i];
			}
					
		}
		else{
			var projectStateStr = localStorage[location.origin];
			if (projectStateStr){
				var temp = JSON.parse(projectStateStr);
				if (temp.type != 'fileUrl'){
					type = temp.type;
					path = temp.path;
				}
			}
		}
		if (type && path && projectState.path != path){
			backgroundMsgSupport.loadProject(type, path, function(){
				loadProject(type, path);
			});
		}
	});
}
checkLocation();

chrome.devtools.panels.create('Local Project', 'icon.png', 'editorpanel.html', function(panel){
	var windowInjector = function(panelWindow){
		window.editorPanelWindow = panelWindow;
		panelWindow.devtoolsWindow = window;
		panelWindow.initUI();
		panel.onShown.removeListener(windowInjector);
	};
	panel.onShown.addListener(windowInjector);
});
