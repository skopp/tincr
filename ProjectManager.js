ProjectManager = function(){
	this.projectsByTab = {};
	this.watchersByTab = {};
}

ProjectManager.prototype = {
	launchFileSelect : function(tabId, typeIndex, sendResponse){
		var projectsByTab = this.projectsByTab;
		nativeFileSupport.launchFileSelect(function(path){
			if (path && path.length){
				var projectType = ProjectTypes[typeIndex];
				window.requestFileSystem(window.PERMANENT, 5*1024*1024*1024, function(fs){
					fs.root.getDirectory(path, {create:false}, function(dir){
						projectType.createProject(dir,function(project, error){
							currentProject = project;
							projectsByTab[tabId] = currentProject;
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
					retVal.push(currentProject.isProjectUrl(urls[i].url));
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
			currentProject.matchContents(url, content, function(success, msg){
				sendResponse({success:success, msg:msg});
			});
		}
	},
	
	updateResource: function(tabId, url, content, sendResponse){
		var currentProject = this.projectsByTab[tabId];
		var currentWatcher = this.watchersByTab[tabId];
		currentProject.commitResource(url, content, currentWatcher, sendResponse);
	},
	
	resetProject : function(tabId, sendResponse){
		var currentProject = this.projectsByTab[tabId];
		currentProject.resetUrls();
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