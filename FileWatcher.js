var FileWatcher = function(tabId, project, path){
	this.tabId = tabId;
	this.project = project;
	this.recentUpdateHandler = new RecentUpdateHandler(2000);
	nativeFileSupport.watchDirectory(tabId.toString(), path, this.fileChanged.bind(this));
}

FileWatcher.prototype = {
	fileChanged : function(path){
		if (this.isMyChange(path)){
			return;
		}
		var urls = this.project.urlsForPath(path)
		if (urls && urls.length){
			var port = chrome.tabs.connect(this.tabId, {name: 'fileChange'});
			var ran = Math.round(Math.random()*10000000);
			urls.asyncEach(function(url, done){
				$.ajax({type: 'GET',
						url: url + '?r=' + ran,
						dataType: 'text',
						success: function(data){
							port.postMessage({url: url, content: data});
							done();
						},
						error: done});
			}, 
			function(){
				port.disconnect();
			});
		}
	},
	isMyChange : function(path){
		return this.recentUpdateHandler.isRecentUpdate(path);
	},
	addChangedByMe : function(path){
		this.recentUpdateHandler.addRecentUpdate(path);
	},
	stopWatching : function(){
		nativeFileSupport.stopWatching(this.tabId.toString());
	}
}
