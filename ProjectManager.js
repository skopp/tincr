ProjectManager = function(){
	this.projectsByTab = {};
	this.watchersByTab = {};
}

ProjectManager.prototype = {
    _initProject : function(tabId, path, url, projectType, sendResponse){
    	var self = this;
    	var projectsByTab = this.projectsByTab;
    	this.cleanUp(tabId);
    	window.requestFileSystem(window.PERMANENT, 5*1024*1024*1024, function(fs){
			fs.root.getDirectory(path, {create:false}, function(dir){
				projectType.createProject(dir,url,function(project, error){
					self.fsRoot = fs.root;
					project.matchedResourceMap = {};
					if (!project.compare){
						project.compare = function(a,b){
							return a === b;
						}
					}
					projectsByTab[tabId] = project;
					sendResponse({path:path, error:error});
				});
			});
		});
    },
    
	launchFileSelect : function(tabId, url, typeIndex, sendResponse){
		var self = this;
		nativeFileSupport.launchFileSelect(function(path){
			if (path && path.length){
				var projectType = ProjectTypes[typeIndex];
				self._initProject(tabId, path, url, projectType, sendResponse);
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
					if (!currentProject.compare(content, localContent)){
					
						var ran = Math.round(Math.random()*10000000);
						var handleError = function(){
							sendResponse({success: false, msg: 'Content for url ' + url + ' doesn\'t match local file ' + path});
							delete currentProject.matchedResourceMap[url];
						}
						
						var handleContent = function(newContent){
							if (!currentProject.compare(newContent,localContent)){
								handleError();
							}else{
								sendResponse({success: true, msg: 'Content for url ' + url + ' was reloaded and it matches local file ' + path, content: newContent });
							}
						}
						
						$.ajax({type: 'GET',
							url: url + (url.indexOf('?') != -1 ? '&' : '?') + 'r=' + ran,
							dataType: 'text',
							success: handleContent,
							error: handleError}); 
						
					}
					else{
						sendResponse({success: true, msg: 'Content for url ' + url + ' matches local file ' + path });
					}
				}, function(){});
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
	loadProject : function(tabId, projectTypeKey, path, url, sendResponse){
		if (projectTypeKey == 'fileUrl'){
			this._initProject(tabId, path, url, FileUrlProjectFactory, sendResponse);
		}
		else{		
			for (var i = 0; i < ProjectTypes.length; i++){
				if (ProjectTypes[i].key === projectTypeKey){
					this._initProject(tabId, path, url, ProjectTypes[i], sendResponse);
					break;
				}
			}
		}
	},
	resetProject : function(tabId, sendResponse){
		var currentProject = this.projectsByTab[tabId];
		currentProject.resetUrls();
		currentProject.matchedResourceMap = {};
		sendResponse();
	},
	watchDirectory : function(port){
		var tabId = port.sender.tab.id;
		var path = port.name;
		if (!this.watchersByTab[tabId]){
			var currentProject = this.projectsByTab[tabId];
			this.watchersByTab[tabId] = new FileWatcher(port, currentProject, path, this.fsRoot);
			//sendResponse();
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