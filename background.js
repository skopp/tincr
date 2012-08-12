var projectManager = new ProjectManager();
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    
    if (request.key == 'ProjectTypes'){
        //var cleanResponse = [];
        //for (var i = 0; i < ProjectTypes.length){
        //  cleanResponse.push({name: ProjectTypes[i].name, locationType: ProjectTypes[i].locationType});
        //}
        sendResponse(ProjectTypes);
    }
    else if (request.key == 'launchFileSelect'){
        projectManager.launchFileSelect(sender.tab.id, request.url, request.index, sendResponse);
    }
    else if (request.key == 'checkResources'){
        projectManager.checkResources(sender.tab.id, request.resources, sendResponse);
    }
    else if (request.key == 'checkResourceContent'){
        projectManager.checkResourceContent(sender.tab.id, request.url, request.content, sendResponse);
    }
    else if (request.key == 'updateResource'){
        projectManager.updateResource(sender.tab.id, request.url, request.content, sendResponse);
    }
    else if (request.key == 'pageChanged'){
        projectManager.resetProject(sender.tab.id, sendResponse);
    }
    else if (request.key == 'loadProject'){
        projectManager.loadProject(sender.tab.id, request.type, request.path, request.url, sendResponse);
    }
    else if (request.key == 'unwatchDirectory'){
        projectManager.unwatchDirectory(sender.tab.id, sendResponse);
    }
    else{
        sendResponse({});
    }
    
});
chrome.extension.onConnect.addListener(function(port){
projectManager.watchDirectory(port);
});
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    projectManager.cleanUp(tabId);
});