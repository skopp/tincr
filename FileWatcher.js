var FileWatcher = function(port, project, path, fsRoot){
	this.port = port;
	var tabId = port.sender.tab.id;
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
			//var port = chrome.tabs.connect(this.tabId, {name: 'fileChange'});
			var ran = Math.round(Math.random()*10000000);
			var self = this;
			urls.asyncEach(function(url, done){
				var sendContentToDevtools = function(data){
					self.port.postMessage({url: url, content: data});
					done();
				}
				
				if (url.indexOf('file://') == 0){
					var startIdx = 7;
					if (url.indexOf('localhost') == 7){
						startIdx = 16;
					}
					Gito.FileUtils.readFile(self.fsRoot, url.substring(startIdx), 'Text', sendContentToDevtools, done);
				}
				else{
					$.ajax({type: 'GET',
							url: url + (url.indexOf('?') != -1 ? '&' : '?') + 'r=' + ran,
							dataType: 'text',
							success: sendContentToDevtools,
							error: done});
				}
			}, 
			function(){
				//port.disconnect();
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
