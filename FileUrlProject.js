FileUrlProject = function(){
	this.projectUrls = {};
};
FileUrlProject.prototype = {
	filePathForUrl : function(url){
		if (url.indexOf('file://') == 0){
			var path = url.substring(7);
			this.projectUrls[path] = url;
			return path;
		}
		return null;
	},
	urlsForFilePath : function(path){
		// It's not necessary to cache the urls since it's just a matter of tacking on the 'file://' 
		// in the front but I don't want to post an update 
		// to the devtools panel unless I know it's an actual project url.
		return [this.projectUrls[path]];
	},
	resetUrls : function(){
		this.projectUrls = {};
	}
}

FileUrlProjectFactory = {
	createProject : function(dir, callback){
		callback(new FileUrlProject());
	}
}
