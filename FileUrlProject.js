FileUrlProject = function(){
	this.projectUrls = {};
};
FileUrlProject.prototype = {
	filePathForUrl : function(url){
		if (url.indexOf('file://') == 0){
			var path;
			if (url.indexOf('localhost') == 7){
				path = url.substring(16);
			}
			else{
				path = url.substring(7);
			}
			this.projectUrls[path] = url;
			return path;
		}
		return null;
	},
	urlsForFilePath : function(path){
		// It's not necessary to cache the urls since it's just a matter of tacking on the 'file://' 
		// in the front but I don't want to post an update 
		// to the devtools panel unless I know it's an actual project url.
		var url = this.projectUrls[path];
		if (url){
			return[url];
		}
		return [];
	},
	resetUrls : function(){
		this.projectUrls = {};
	}
}

FileUrlProjectFactory = {
	createProject : function(dir, url, callback){
		callback(new FileUrlProject());
	}
}
