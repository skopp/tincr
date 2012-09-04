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
var UrlToDirectoryMappedProject = function(routes){
	this.projectUrls = {};
	this.routes = routes;
	this.isWin = navigator.platform.indexOf('Win') == 0;
}

UrlToDirectoryMappedProject.prototype = {
	filePathForUrl : function(url){
		var routes = this.routes;
		for (var i = 0; i < routes.length; i++){
			if (url.indexOf(routes[i].from) == 0){
				var path = url.replace(routes[i].from, routes[i].to);
				if (this.isWin){
					path = path.replace(/\//g, '\\');
				}
				this.projectUrls[path] = url;
				return path;
			}
		}
	},
	urlsForFilePath : function(path){
		var url = this.projectUrls[path]
		if (url){
			return [url];
		}
		else{
			return null;
		}
	},
	resetUrls : function(){
		this.projectUrls = {};
	}
}
var chromeUrlRegex = /chrome-extension\:\/\/[a-zA-Z]+\//;
ProjectTypes.push(
    {
		name: 'Chrome Extension',
		key: 'chrome.extension',
		locationType : 'local',
		createProject : function(root, url, callback){	
			var match = url.match(chromeUrlRegex);
			if (match){
				url = match[0];
			}
			var routes = [{from: url, to: root.fullPath + '/'}];
			var project = new UrlToDirectoryMappedProject(routes);
			callback(project);
		} 
    }
);