
var backgroundMsgSupport = {
	launchFileSelect : function(index, url,  callback){
		chrome.extension.sendRequest({key: 'launchFileSelect', index: index, url: url}, function(response){
			callback(response);
		});
	},
	getProjectTypes : function(callback){
		chrome.extension.sendRequest({key : 'ProjectTypes'}, function(response){
			callback(response);
		});
	},
	checkResources : function(resources, callback){
		chrome.extension.sendRequest({key : 'checkResources', resources: resources}, function(response){
			callback(response);
		});
	},
	checkResourceContent : function(url, content, callback){
		chrome.extension.sendRequest({key : 'checkResourceContent', url: url, content:content}, function(response){
			callback(response);
		});
	},
	updateResource : function(url, content, callback){
		chrome.extension.sendRequest({key : 'updateResource', url: url, content:content}, function(response){
			callback(response);
		});
	},
	pageChanged : function(callback){
		chrome.extension.sendRequest({key: 'pageChanged'}, callback);
	},
	
	unwatchDirectory : function(callback){
		chrome.extension.sendRequest({key: 'unwatchDirectory'}, callback); 
	},
	loadProject : function(type, path, url, callback){
		chrome.extension.sendRequest({key: 'loadProject', type: type, path: path, url: url}, function(response){
			callback(response);
		});
	}
}
