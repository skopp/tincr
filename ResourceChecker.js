
var matchedUrls = {};
var navListenerRegistered = false;
var resourceCache = [];
var recentUpdateHandler = new RecentUpdateHandler(500);

var matchResourcesWithProject = function(resources){
	var confirmResourceContent = function(resource){
		resource.getContent(function(content){
			backgroundMsgSupport.checkResourceContent(resource.url, content, function(data){
				if (data.success){
					logMessage(data.msg);
					matchedUrls[resource.url] = true;
				}
				else{
					logError(data.msg);
				}
			});
		});
	};
	
	backgroundMsgSupport.checkResources(resources, function(data){
		for (var i = 0; i < data.length; i++){
			if (data[i]){
				confirmResourceContent(resources[i]);
			}
		}
	});
}

var checkResources = function(callback){
	matchedUrls = {};

	chrome.devtools.inspectedWindow.getResources(function(resources){
		resourceCache = resources;
		matchResourcesWithProject(resources);
	});
}
var registerNavListener = function(){
	if (!navListenerRegistered){
		chrome.devtools.network.onNavigated.addListener(function(){
			console.log('page navigated');
			backgroundMsgSupport.pageChanged(function(){
				checkResources();
			});
		});
		chrome.devtools.inspectedWindow.onResourceAdded.addListener(function(resource){
			console.log('resource added');
			matchResourcesWithProject([resource]);
		});
	}
	navListenerRegistered = true;
}
chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(function(resource, content){
	if (matchedUrls[resource.url] && !recentUpdateHandler.isRecentUpdate(resource.url)){
		backgroundMsgSupport.updateResource(resource.url, content);
	}
});

var fileChangeListener = function(data){
	var setContent = function(resource, data){
		resource.getContent(function(content){
			if (data.content != content){
				recentUpdateHandler.addRecentUpdate(resource.url);
				resource.setContent(data.content, true);
			}
		});
	};
	for (var i = 0; i < resourceCache.length; i++){
		if (resourceCache[i].url === data.url){
			setContent(resourceCache[i], data);
		}
	}
};
chrome.extension.onConnect.addListener(function(port) {
	if (port.name == 'fileChange'){
		port.onMessage.addListener(fileChangeListener);
	}
});