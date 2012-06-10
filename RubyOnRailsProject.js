var slash = navigator.platform.indexOf('Win') == 0 ? '\\' : '/';

var RubyOnRails31Project = function(root, routes){
	this.routes = routes;
	this.rootPath = root.fullPath;
	//used to strip off .coffee, .less, .scss, etc. off the end of a file name
	this.stripRegex = /(\.js|\.css)\.[a-zA-Z]+$/
	this.projectUrls = {};
}

RubyOnRails31Project.prototype = {
	filePathForUrl : function(url){
		var routes = this.routes;
		for (var i = 0; i < routes.length; i++){
			var match = url.match(routes[i].from);
			if (match){
				var partialPath = match[0].replace(routes[i].from, routes[i].to);
				var path = this.rootPath + (partialPath.charAt(0) == '/' ? '' : '/') + partialPath;
				this.projectUrls[path] = url;
			}
		}
		return null;
	},
	
	urlsForFilePath : function(path){
		var strippedPath = path.replace(this.stripRegex, '$1');
		var url = this.projectUrls[strippedPath];
		if (url){
			return [url];
		}
	 	return [];
	},
	resetUrls : function(){
		this.projectUrls = {};
	}
}

ProjectTypes.push(
    {
		name: 'Ruby on Rails (3.1 or higher)',
		key: 'ror3.1',
		locationType : 'local',
		createProject : function(root, callback){
			routes = [
				{from: /\/assets\/(.+\.js)/,
				 to: slash + ['app','assets','javascripts'].join(slash) + slash + '$1'},
				{from: /\/assets\/(.+\.css)/,
				 to: slash + ['app','assets','stylesheets'].join(slash) + slash + '$1'}
			];
			var project = new RubyOnRails31Project(root, routes);
			callback(project);
		} 
    }
);

/*var RubyOnRails31Project = function(){
	this.processedMap = {};	
}

RubyOnRails31Project.prototype = {
    _loadResourceMappings : function(dir, prefix, callback){
		Gito.FileUtils.ls(dir, function(jsEntries){
			for (var i = 0; i < jsEntries.length; i++){
				var jsEntry = jsEntries[i];
				var jsIdx = jsEntry.name.indexOf('.js.');
				if (jsIdx != -1){
					jsEntry
				}
			}
		});
	},
	load : function(root, callback){
		this.root = root;
		this.assetRoot = root.fullPath + slash + ['app','assets'].join(slash) + slash;
		callback();
	},
	filePathForUrl : function(url, type){
		var pieces = url.split('/');
		for (var min = 0; min < pieces.length; min++){
			if (pieces[min] == 'assets'){
				break;
			}
		}
		var last = pieces.length - 1
		if (min >= last){
			return null;
		}
		
		var partialPath = pieces.slice(min).join('/');
		if (type == 'script'){
			partialPath = 'javascripts/' + partialPath;
		}
		else{
			partialPath = 'stylesheets/' + partialPath; 
		}
		
		return this.root.fullPath + '/assets/' + partialPath
	},
	urlsForFilePath : function(path){
		var assetRoot = this.assetRoot;
		if (path.indexOf(assetRoot) == 0){
			var partialPath = path.substring(assetRoot.length);
			if (partialPath.indexOf('javascripts') == 0){
				
			}
			else if (partialPath.indexOf('stylesheets') == 0){
				
			}
		}
		return [];
	},
	resetUrls : function(){
		this.projectUrls = {};
	}
}*/

