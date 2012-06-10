var FileWatcher = function(tabId, project, path, fsRoot){
	this.tabId = tabId;
	this.project = project;
	this.recentUpdateHandler = new RecentUpdateHandler(2000);
	this.fsRoot = fsRoot;
	nativeFileSupport.watchDirectory(tabId.toString(), path, this.fileChanged.bind(this));
}

FileWatcher.prototype = {
	fileChanged : function(path){
		//console.log(path); 
		if (this.isMyChange(path)){
			return;
		}
		var urls = this.project.urlsForFilePath(path)
		if (urls && urls.length){
			var port = chrome.tabs.connect(this.tabId, {name: 'fileChange'});
			var ran = Math.round(Math.random()*10000000);
			var self = this;
			urls.asyncEach(function(url, done){
				var sendContentToDevtools = function(data){
					port.postMessage({url: url, content: data});
					done();
				}
				
				if (url.indexOf('file://') == 0){
					Gito.FileUtils.readFile(self.fsRoot, url.substring(7), 'Text', sendContentToDevtools, done);
				}
				else{
					$.ajax({type: 'GET',
							url: url + '?r=' + ran,
							dataType: 'text',
							success: sendContentToDevtools,
							error: done});
				}
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
