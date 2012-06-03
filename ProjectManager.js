ProjectManager = function(){
	this.projectsByTab = {};
	this.watchersByTab = {};
}

ProjectManager.prototype = {
	launchFileSelect : function(tabId, typeIndex, sendResponse){
		var projectsByTab = this.projectsByTab;
		var self = this;
		nativeFileSupport.launchFileSelect(function(path){
			if (path && path.length){
				var projectType = ProjectTypes[typeIndex];
				window.requestFileSystem(window.PERMANENT, 5*1024*1024*1024, function(fs){
					fs.root.getDirectory(path, {create:false}, function(dir){
						projectType.createProject(dir,function(project, error){
							self.fsRoot = fs.root;
							project.matchedResourceMap = {};
							projectsByTab[tabId] = project;
							sendResponse({path:path, error:error});
						});
					});
				});
			}
		});
	},
	
	checkResources : function(tabId, urls, sendResponse){
		var currentProject = this.projectsByTab[tabId];
		var retVal = [];
		if (currentProject){
			for (var i = 0; i < urls.length; i++){
				if (urls[i].type == 'script' || urls[i].type == 'stylesheet'){
					var url = urls[i].url;
				    var filePath = currentProject.filePathForUrl(url);
				    if (filePath){
				    	currentProject.matchedResourceMap[url] = filePath;
				    }
				    retVal.push(filePath != null);
				}
				else{
					retVal.push(false);
				}
			}
		}
		sendResponse(retVal);
	},
	
	checkResourceContent : function(tabId, url, content, sendResponse){
		var currentProject = this.projectsByTab[tabId];
		if (currentProject){
			var path = currentProject.matchedResourceMap[url];
			if (path){
				Gito.FileUtils.readFile(this.fsRoot, path, 'Text', function(localContent){
					if (content != localContent){
						sendResponse({success: false, msg: 'Content for url ' + url + ' doesn\'t match local file ' + path}); 
						delete currentProject.matchedResourceMap[url];
					}
					else{
						sendResponse({success: true, msg: 'Content for url ' + url + ' matches local file ' + path });
					}
				});
			}
		}
	},
	
	updateResource: function(tabId, url, content, sendResponse){
		var currentProject = this.projectsByTab[tabId];
		var watcher = this.watchersByTab[tabId];
		//currentProject.commitResource(url, content, currentWatcher, sendResponse);
		var localPath = currentProject.matchedResourceMap[url];
		if (localPath){
			watcher.addChangedByMe(localPath);
			Gito.FileUtils.mkfile(this.fsRoot, localPath, content, sendResponse);
		}
		else{
			sendResponse();
		}
	},
	
	resetProject : function(tabId, sendResponse){
		var currentProject = this.projectsByTab[tabId];
		currentProject.resetUrls();
		currentProject.matchedResourceMap = {};
		sendResponse();
	},
	watchDirectory : function(tabId, path){
		if (!this.watchersByTab[tabId]){
			var currentProject = this.projectsByTab[tabId];
			this.watchersByTab[tabId] = new FileWatcher(tabId, currentProject, path);
		}
	},
	cleanUp : function(tabId){
		if (this.projectsByTab[tabId])
			delete this.projectsByTab[tabId];
		  			
		var watcher = this.watchersByTab[tabId];
		if (watcher){
			watcher.stopWatching();
			delete this.watchersByTab[tabId];	
		}
	}
}