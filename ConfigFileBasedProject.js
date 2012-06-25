var isWin = navigator.platform.indexOf('Win') == 0;

var ConfigFileBasedProject = function(config, root, url){
	var routesStr = config.toFile;
	var toFileRoutes = [];
	for (var i = 0; i < routesStr.length; i++){
		toFileRoutes.push({from: new RegExp(routesStr[i].from), to: routesStr[i].to});
	}
	this.toFileRoutes = toFileRoutes;
	routesStr = config.fromFile;
	var fromFileRoutes = [];
	if (routesStr){
		for (var i = 0; i < routesStr.length; i++){
			fromFileRoutes.push({from: new RegExp(routesStr[i].from), to: routesStr[i].to});
		}
		this.fromFileRoutes = fromFileRoutes;
	}
	this.projectUrls = {};
	this.rootPath = root.fullPath;
	this.url = url;
	if (isWin){
		this.replaceSlashes = function(str){
			return str.replace('/', '\\');
		}
	}
	else{
		this.replaceSlashes = function(str){return str;};
	}
}

ConfigFileBasedProject.prototype = {
	_doRegexConversion : function(str, root, from, to){
		var match = str.match(from);
		if (match){
			var partialPath = match[0].replace(from, to);
			var path = root + (partialPath.charAt(0) == '/' ? '' : '/') + partialPath;
			return path;
		}
		return null;
	},
	filePathForUrl : function(url){
		var routes = this.toFileRoutes;
		for (var i = 0; i < routes.length; i++){
			var path = this._doRegexConversion(url, this.rootPath, routes[i].from, routes[i].to);
			if (path){
				this.projectUrls[this.replaceSlashes(path)] = url;
				return path;
			}
		}
		return null;
	},
	
	urlsForFilePath : function(path){
		var routes = this.fromFileRoutes;
		for (var i = 0; i < routes.length; i++){
			var url = this._doRegexConversion(path, this.url, routes[i].from, routes[i].to);
			if (url){
				return [url];
			}
		}
		var url = this.projectUrls[path];
		if (url){
			return [url];
		}
	 	return [];
	},
	resetUrls : function(){
		this.projectUrls = {};
	}
}