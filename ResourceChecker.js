/*
* Copyright 2012 Ryan Ackley (ryanackley@gmail.com)
*
* This file is part of Tincr.
*
* Tincr is free software: you can redistribute it and/or
* modify it under the terms of the GNU General Public License
* as published by the Free Software Foundation; either version 2
* of the License, or (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

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
					if (data.content){
						doResourceUpdate(resource, data.content);
					}
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
			backgroundMsgSupport.pageChanged(function(){
				checkResources();
			});
		});
		chrome.devtools.inspectedWindow.onResourceAdded.addListener(function(resource){
			resourceCache.push(resource);
			matchResourcesWithProject([resource]);
		});
	}
	navListenerRegistered = true;
}
chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(function(resource, content){
	if (projectState.autosave && matchedUrls[resource.url] && !recentUpdateHandler.isRecentUpdate(resource.url)){
		backgroundMsgSupport.updateResource(resource.url, content);
	}
});
var doResourceUpdate = function(resource, newContent){
	recentUpdateHandler.addRecentUpdate(resource.url);
	resource.setContent(newContent, true);
	logMessage('Auto-Reloaded ' + resource.url);
};
var fileChangeListener = function(data){
	// resource content seems to be naively cached. No way to get the most recent content without
	// storing it ourselves. Does it matter that much?
	/*var setContent = function(resource, data){
		resource.getContent(function(content){
			if (data.content != content){
				recentUpdateHandler.addRecentUpdate(resource.url);
				resource.setContent(data.content, true);
			}
		});
	};*/
	for (var i = 0; i < resourceCache.length; i++){
		if (resourceCache[i].url === data.url){
			//setContent(resourceCache[i], data);
			var resource = resourceCache[i];
			doResourceUpdate(resource, data.content);
		}
	}
};
/*chrome.extension.onConnect.addListener(function(port) {
	if (port.name == 'fileChange'){
		port.onMessage.addListener(fileChangeListener);
	}
});*/