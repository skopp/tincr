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
// Most of the logic happens in devtools.html since it loads right away
var projectState = {};
var inspectedLocation;
var watchPort;

var saveProjectState = function(){
	if (projectState.type != 'fileUrl'){
		localStorage[inspectedLocation.origin] = JSON.stringify(projectState);
	}
	else{
		var temp = {autosave: projectState.autosave, watchFiles: projectState.watchFiles};
		localStorage[inspectedLocation.origin] = JSON.stringify(temp);
	}
}

var loadProject = function(type, path, autosave, watchFiles){
	checkResources();
	registerNavListener();
	
	toggleWatchingFiles(watchFiles, path);
	projectState = {type: type, path: path, autosave:autosave, watchFiles:watchFiles};
	saveProjectState();
};

var toggleWatchingFiles = function(enable, path, callback){
	projectState.watchFiles = enable;
	var registerWatch = function(){
		if (enable){
			watchPort = chrome.extension.connect({name:path});
			watchPort.onMessage.addListener(fileChangeListener);
		}
		if (callback){
			callback();
		}	
	}
	
	if (watchPort){
		watchPort.disconnect();
		backgroundMsgSupport.unwatchDirectory(function(){
			registerWatch();
		});
	}
	else{
		registerWatch();
	}
	
}

var checkLocation = function(){
	chrome.devtools.inspectedWindow.eval('this.location', function(location, isException){
		if (inspectedLocation && location.origin === inspectedLocation.origin){
			return;
		}
		inspectedLocation = location;
		// file protocol is a special case
		var type,path,temp;
		if (location.protocol == 'file:'){
			var pathElements = location.pathname.split("/");
			type = 'fileUrl';
			path = '';
			// get the root directory of the currently viewed html page.
			for (var i = 1; i < pathElements.length - 1; i++){
				path = path + '/' + pathElements[i];
			}
			if (path.charAt(0) == '/' && navigator.platform.indexOf('Win') == 0){
				path = path.substring(1);
			}
			var projectStateStr = localStorage[location.origin];
			if (projectStateStr){
				temp = JSON.parse(projectStateStr);
			}
			else{
				temp = {autosave: true, watchFiles: true};
			}
		}
		else{
			var projectStateStr = localStorage[location.origin];
			if (projectStateStr){
				temp = JSON.parse(projectStateStr);
				if (temp.type != 'fileUrl'){
					type = temp.type;
					path = temp.path;
				}
			}
		}
		if (type && path && projectState.path != path){
			backgroundMsgSupport.loadProject(type, path, inspectedLocation.origin, function(data){
				if (data.error){
					logError(data.error);
				}
				else{
					loadProject(type, path, temp.autosave, temp.watchFiles);
				}
			});
		}
	});
}
checkLocation();
toggleLogging(localStorage['logging'] === 'true');

chrome.devtools.panels.create(' Tincr ', 'icon.png', 'editorpanel.html', function(panel){
	var windowInjector = function(panelWindow){
		window.editorPanelWindow = panelWindow;
		panelWindow.devtoolsWindow = window;
		panelWindow.initUI();
		panel.onShown.removeListener(windowInjector);
	};
	panel.onShown.addListener(windowInjector);
});
