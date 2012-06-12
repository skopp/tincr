var UrlToDirectoryMappedProject = function(routes){
	this.projectUrls = {};
	this.routes = routes;
	this.isWin = navigator.platform.indexOf('Win') == 0;
}

UrlToDirectoryMappedProject.prototype = {
	filePathForUrl : function(url){
		var routes = this.routes;
		for (var i = 0; i < routes.length; i++){
			if (url.indexOf(routes[i].from) == 0){
				var path = url.replace(routes[i].from, routes[i].to);
				if (this.isWin){
					path = path.replace('/', '\\');
				}
				this.projectUrls[path] = url;
				return path;
			}
		}
	},
	urlsForFilePath : function(path){
		var url = this.projectUrls[path]
		if (url){
			return [url];
		}
		else{
			return null;
		}
	},
	resetUrls : function(){
		this.projectUrls = {};
	}
}
var chromeUrlRegex = /chrome-extension\:\/\/[a-zA-Z]+\//;
ProjectTypes.push(
    {
		name: 'Chrome Extension',
		key: 'chrome.extension',
		locationType : 'local',
		createProject : function(root, url, callback){	
			var match = url.match(chromeUrlRegex);
			if (match){
				url = match[0];
			}
			var routes = [{from: url, to: root.fullPath + '/'}];
			var project = new UrlToDirectoryMappedProject(routes);
			callback(project);
		} 
    }
);